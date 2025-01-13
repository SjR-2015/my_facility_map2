let map;
let markers = [];
let selectedTypes = new Set();

async function fetchJSON(filePath) {
    const response = await fetch(filePath);
    return await response.json();
}

async function initMap() {
    const facilities = await fetchJSON('data/facilities.json');
    const facilityTypes = await fetchJSON('data/facility_types.json');
    const attributeDefinitions = await fetchJSON('data/attribute_definitions.json');

    const facilityButtonsContainer = document.getElementById('facility-buttons');

    // Leafletマップの初期化（`index.js`から座標情報を取得）
    map = L.map('map').setView(initialCoordinates, initialZoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 施設分類ボタンを生成
    facilityTypes.facility_types.forEach((type, index) => {
        const button = document.createElement('button');
        button.textContent = type.facility_type_name;
        button.style.backgroundColor = type.color;  // 色を設定
        if (index === 0) {
            button.classList.add('selected'); // 最初のボタンを選択状態にする
            selectedTypes.add(type.facility_type_id); // 最初の施設タイプを選択状態にする
            showFacilities(selectedTypes, facilities, attributeDefinitions, facilityTypes); // 最初の施設のピンを表示する
        }
        button.onclick = () => {
            button.classList.toggle('selected');
            if (selectedTypes.has(type.facility_type_id)) {
                selectedTypes.delete(type.facility_type_id);
                button.classList.remove('selected'); // 選択解除時のスタイル
            } else {
                selectedTypes.add(type.facility_type_id);
                button.classList.add('selected'); // 選択時のスタイル
            }
            showFacilities(selectedTypes, facilities, attributeDefinitions, facilityTypes);
        };
        facilityButtonsContainer.appendChild(button);
    });

    function showFacilities(typeIds, facilities, attributeDefinitions, facilityTypes) {
        clearMarkers();
        typeIds.forEach(typeId => {
            const selectedFacilityType = facilityTypes.facility_types.find(type => type.facility_type_id === typeId);
            facilities.facilities
                .filter(facility => facility.facility_type_id === typeId)
                .forEach(facility => addMarker(facility, attributeDefinitions, selectedFacilityType.color));
        });
    }

    function addMarker(facility, attributeDefinitions, color) {
        const marker = L.marker([facility.latitude, facility.longitude], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color:${color}; width: 12px; height: 12px; border-radius: 50%;"></div>`
            })
        }).addTo(map);

        const additionalInfo = attributeDefinitions.attribute_definitions.map(attr => {
            const value = facility[`reserve${attr.attribute_id}`];
            if (value && value.startsWith('http')) {
                // URLの場合、HTMLリンクとして表示
                return `<div><strong>${attr.reserve_name}:</strong> <a href="${value}" target="_blank">${value}</a></div>`;
            } else {
                return `<div><strong>${attr.reserve_name}:</strong> ${value}</div>`;
            }
        }).join('');

        const popupContent = `
            <b>施設名:</b> ${facility.facility_name}<br>
            <b>住所:</b> ${facility.address}<br>
            ${additionalInfo}
        `;
        marker.bindPopup(popupContent);
        markers.push(marker);
    }

    function clearMarkers() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    }
}

document.addEventListener('DOMContentLoaded', initMap);
