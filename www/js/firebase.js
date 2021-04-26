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

            const height = heightData.length > 0 ? heightData[0] + " m" : "";
            const ending = endingData.length > 0 ? `<span class="eaic-icon ${endingData[0]}"></span>` : "";
            const safes = safeDisplay(data.burilCount, data.stringCount, "buril") +
                safeDisplay(data.paraboltCount, data.stringCount, "parabolt") +
                safeDisplay(data.pitonCount, data.stringCount, "piton") +
                safeDisplay(data.spitCount, data.stringCount, "spit") +
                safeDisplay(data.tensorCount, data.stringCount, "tensor");

            contentTable.innerHTML += `<tr>
        <td>${data.sketchId}</td>
        <td>${data.displayName}</td>
        <td>${data.grade}</td>
        <td>${safes}</td>
        <td>${height}</td>
        <td>${ending}</td>
    </tr>`;
        });
    });