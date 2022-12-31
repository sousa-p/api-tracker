const btnSearch = document.querySelector("#search");
const inputIpAddress = document.querySelector("#ipAddress");
inputIpAddress.value = "";

const infos = document.querySelectorAll(".ip_infos > .info > .text_info");

const map = L.map("map");
const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: "<img src='./images/icon-location.svg' class='icon'>",
    iconSize: [46, 56],
    iconAnchor: [32, 56],
});

btnSearch.addEventListener("click", () => {
    let ip;
    ip = inputIpAddress.value;

    if (isValidIp(ip)) {
        requestIpAddress(ip);
        correctIpAddress();
    } else {
        errIpAddress();
    }
});
requestIpAddress();

async function requestIpAddress(ip = "", key = "") {
    fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${key}&ipAddress=${ip}`
    )
        .then((data) => {
            return data.json();
        })
        .then((dataIp) => {
            console.log(dataIp)
            let ip, location, timezone, isp;
            ip = dataIp.ip;
            location = `${dataIp.location.country}, ${dataIp.location.region}, ${dataIp.location.city}`;
            timezone = `UTC${dataIp.location.timezone}`;
            isp = dataIp.isp;
            attInfos(ip, location, timezone, isp);
            return dataIp;
        })
        .then((dataIp) => {
            let lat, lng;
            lat = dataIp.location.lat;
            lng = dataIp.location.lng;
            attMap(lat, lng);
        })
        .catch((err) => {
            alert(`Ops! :((\n${err}`);
            throw (err);
        });
}

function isValidIp(ip) {
    let pattern;
    pattern =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    return ip.match(pattern);
}

function errIpAddress() {
    inputIpAddress.classList.add("err");
}

function correctIpAddress() {
    inputIpAddress.classList.remove("err");
}

function attInfos(ip, location, timezone, isp) {
    infos[0].textContent = ip;
    infos[1].textContent = location;
    infos[2].textContent = timezone;
    infos[3].textContent = isp;
}

function attMap(lat, lng) {
    let marker;
    map.setView([lat, lng], 13);
    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
}
