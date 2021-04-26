const firebaseConfig = {
    apiKey: "AIzaSyB7ADMgL0XyV4dfbHxxTnsMFXIHZh1DQSo",
    authDomain: "escalaralcoiaicomtat.firebaseapp.com",
    databaseURL: "https://escalaralcoiaicomtat.firebaseio.com",
    projectId: "escalaralcoiaicomtat",
    storageBucket: "escalaralcoiaicomtat.appspot.com",
    messagingSenderId: "532137251314",
    appId: "1:532137251314:web:985a0745bd90ac8cd01b6b",
    measurementId: "G-49HGMS07LW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

const query_string = window.location.search.substring(1);
const parsed_qs = parse_query_string(query_string);
const area = parsed_qs.area
const zone = parsed_qs.zone
const sector = parsed_qs.sector

console.log("area:", area, "zone:", zone, "sector:", sector)

// Sample: &area=PL5j43cBRP7F24ecXGOR&zone=3DmHnKBlDRwqlH1KK85C&sector=B9zNqbw6REYVxGZxlYwh
if (area != null && zone != null && sector != null)
    db.collection("Areas")
        .doc(area)
        .collection("Zones")
        .doc(zone)
        .collection("Sectors")
        .doc(sector)
        .collection("Paths")
        .orderBy("sketchId")
        .get().then((querySnapshot) => {
        const contentTable = document.getElementById('content');
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const heightData = data.height;
            const endingData = data.ending;

            console.log(`${doc.id} =>`, data);

            const safeDisplay = function (count, stringsCount, icon) {
                if (count > 0)
                    return (stringsCount > 0 ? count : "") + `<i class="eaic-icon ${icon}"></i>`
                return ""
            }
            const getGradeColor = function (grade) {
                if (grade.substr(0, 1) === "L")
                    return this(grade.substr(3));

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

            const height = heightData.length > 0 ? heightData[0] + " m" : "";
            const ending = endingData.length > 0 ? `<span class="eaic-icon ${endingData[0]}"></span>` : "";
            const safes = safeDisplay(data.burilCount, data.stringCount, "buril") +
                safeDisplay(data.paraboltCount, data.stringCount, "parabolt") +
                safeDisplay(data.pitonCount, data.stringCount, "piton") +
                safeDisplay(data.spitCount, data.stringCount, "spit") +
                safeDisplay(data.tensorCount, data.stringCount, "tensor");
            const processedGrade = processGrade(data.grade);

            contentTable.innerHTML += `<tr>
        <td>${data.sketchId}</td>
        <td>${data.displayName}</td>
        <td>${processedGrade}</td>
        <td>${safes}</td>
        <td>${height}</td>
        <td>${ending}</td>
    </tr>`;
        });
    });