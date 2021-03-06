(() => {
    try {
        // http://arnyminerz.com:3000/api/data/Sectors/0hk1PdLsYwx0DjVKlpRq
        const contentTable = document.getElementById('content');

        const parsed_qs = getUrlParameters();
        const sectorParam = parsed_qs['sector']
        const splitPathParam = parsed_qs.hasOwnProperty('path') ? parsed_qs['path'].split('/') : null;

        const sector = sectorParam != null ? sectorParam :
            splitPathParam.includes("Sectors") ? splitPathParam[splitPathParam.length - 1] : null;

        console.log("sector:", sector);

        // Sample: &area=PL5j43cBRP7F24ecXGOR&zone=3DmHnKBlDRwqlH1KK85C&sector=B9zNqbw6REYVxGZxlYwh
        if (sector != null) {
            /**
             * @type {{sketchId:number,displayName:string,processedGrade:string,safes:string,height:string,ending:string,builtBy:string}[]}
             */
            const resultList = [];

            document.title = `Sector View - ${sector}`;

            const jsonRaw = httpGet(`${BACKEND_PROTOCOL}${BACKEND_SERVER}/api/list/Paths/${sector}`);
            /**
             * @type {{result:Object.<string,Object>}}
             */
            const json = JSON.parse(jsonRaw);
            const resultJson = json.result;
            const objectIds = Object.keys(resultJson);

            for (const objectId in objectIds) {
                /**
                 * @type {{builtBy:string,burilCount:number,crackerRequired:boolean,created:string,description:string|null,displayName:string,ending:string|null,friendRequired:boolean,grade:string|null,height:string|null,lanyardRequired:boolean,last_edit:string,nailRequired:boolean,paraboltCount:number,pitch_info:string|null,pitonCount:number,pitonRequired:boolean,rebuilders:string|null,sector:string,showDescription:boolean,sketchId:number,spitCount:int,stringCount:int,stripsRequired:boolean,tensorCount:number}}
                 */
                const data = Object.values(resultJson)[objectId];

                const heightData = parseMultiPitch(data.height);
                const endingData = parseMultiPitch(data.ending);
                const gradeData = parseMultiPitch(data.grade);

                const safeDisplay = function (count, stringsCount, icon) {
                    if (count > 0)
                        return (stringsCount > 0 ? count : "") + `<i class="eaic-icon ${icon}"></i>`
                    return ""
                }
                const getGradeColor = function (grade) {
                    if (grade.substring(0, 1) === "L")
                        return this(grade.substring(3));

                    let gradeColor = "#222222";
                    if (grade[0] === "A")
                        gradeColor = "#dbde26";
                    else if (grade[0] === "8")
                        gradeColor = "#000000";
                    else if (grade[0] === "7")
                        gradeColor = "#d30b1d";
                    else if (grade[0] === "6")
                        gradeColor = "#4b82db";
                    else if (grade[0] === "5" || grade[0] === "4" || grade[0] === "3")
                        gradeColor = "#2aa349";
                    return gradeColor;
                }
                const processGrade = function (grade) {
                    let builder = "";
                    const pieces = grade.split("/");
                    for (let p = 0; p < pieces.length; p++)
                        if (pieces.hasOwnProperty(p)) {
                            const piece = pieces[p];
                            const color = getGradeColor(piece)
                            let obj = `<span style="color:${color}">${piece}</span>`;
                            if (pieces.length - p > 1)
                                obj += `<span style="color:#666666">/</span>`;
                            builder += obj;
                        }
                    return builder;
                }

                /**
                 * Applies span colors to a grade text.
                 * @author Arnau Mora
                 * @since 20220321
                 * @param grade
                 */
                const colorizeGrade = (grade) => {

                };

                const height = heightData.general != null ? heightData.general + " m" : "";
                const ending = endingData.general != null ? `<span class="eaic-icon ${endingData.general}"></span>` : "";
                const safes = safeDisplay(data.burilCount, data.stringCount, "buril") +
                    safeDisplay(data.paraboltCount, data.stringCount, "parabolt") +
                    safeDisplay(data.pitonCount, data.stringCount, "piton") +
                    safeDisplay(data.spitCount, data.stringCount, "spit") +
                    safeDisplay(data.tensorCount, data.stringCount, "tensor");
                const processedGrade = processGrade(gradeData.general);

                let builtBy = data.builtBy;
                builtBy = builtBy !== 'NULL' ? builtBy.replace(';', ' ') : null;

                resultList.push({
                    sketchId: data.sketchId,
                    displayName: data.displayName,
                    builtBy: builtBy,
                    processedGrade,
                    safes,
                    height,
                    ending
                });
            }

            resultList.sort((a, b) => a.sketchId - b.sketchId);

            resultList.forEach((item) => {
                const builder = !item.builtBy ? "" : `<br/><small style="color: #aaaaaa; font-style: italic; font-size: 16px">${item.builtBy}</small>`;
                contentTable.innerHTML +=
                    `<tr>
                    <td>${item.sketchId}</td>
                    <td>${item.displayName}${builder}</td>
                    <td>${item.processedGrade}</td>
                    <td>${item.safes}</td>
                    <td>${item.height}</td>
                    <td>${item.ending}</td>
                </tr>`;
            });
        } else {
            document.title = "Invalid request";
            document.body.innerHTML = "Invalid request";
        }
    } catch (e) {
        document.title = "Invalid request";
        document.body.innerHTML = "Invalid request";
        console.error("Error:", e);
    }
})();
