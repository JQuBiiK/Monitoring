document.addEventListener('DOMContentLoaded', () => {

    const cargoList = [
        {
            id: "CARGO001",
            name: "Строительные материалы",
            status: "В пути",
            origin: "Москва",
            destination: "Казань",
            departureDate: "2024-11-24"
        },
        {
            id: "CARGO002",
            name: "Хрупкий груз",
            status: "Ожидает отправки",
            origin: "Санкт-Петербург",
            destination: "Екатеринбург",
            departureDate: "2024-11-26"
        }
    ];

    function updateCargoTable() {
        const filterStatus = document.getElementById("status-filter").value;
        const cargoTable = document.getElementById("cargo-table");
        cargoTable.innerHTML = '';

        const filteredCargoList = filterStatus === 'all' ? cargoList : cargoList.filter(cargo => cargo.status === filterStatus);

        filteredCargoList.forEach(cargo => {
            let statusClass = '';
            switch(cargo.status) {
                case 'Ожидает отправки':
                    statusClass = 'status-awaiting';
                    break;
                case 'В пути':
                    statusClass = 'status-in-transit';
                    break;
                case 'Доставлен':
                    statusClass = 'status-delivered';
                    break;
                default:
                    statusClass = 'status-awaiting';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cargo.id}</td>
                <td>${cargo.name}</td>
                <td class="${statusClass}">${cargo.status}</td>
                <td>${cargo.origin}</td>
                <td>${cargo.destination}</td>
                <td>${cargo.departureDate}</td>
                <td>
                    <select class="status-select form-select" data-cargo-id="${cargo.id}">
                        <option value="Ожидает отправки" ${cargo.status === "Ожидает отправки" ? 'selected' : ''}>Ожидает отправки</option>
                        <option value="В пути" ${cargo.status === "В пути" ? 'selected' : ''}>В пути</option>
                        <option value="Доставлен" ${cargo.status === "Доставлен" ? 'selected' : ''}>Доставлен</option>
                    </select>
                </td>
            `;
            cargoTable.appendChild(row);
        });

        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (event) => {
                const id = event.target.getAttribute('data-cargo-id');
                const status = event.target.value;
                updateCargoStatus(id, status);
            });
        });
    }

    function updateCargoStatus(id, status) {
        const cargo = cargoList.find(cargo => cargo.id === id);
        if (status === "Доставлен" && new Date(cargo.departureDate) > new Date()) {
            alert("Ошибка: Невозможно установить статус 'Доставлен', если дата отправления в будущем.");
            return;
        }
        cargo.status = status;
        updateCargoTable();
    }

    document.getElementById("cargo-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("cargo-name").value;
        const origin = document.getElementById("origin").value;
        const destination = document.getElementById("destination").value;
        const departureDate = document.getElementById("departure-date").value;
        const status = document.getElementById("status").value;

        if (!name || !origin || !destination || !departureDate || !status) {
            alert("Все поля должны быть заполнены!");
            return;
        }

        const newCargo = {
            id: `CARGO${String(cargoList.length + 1).padStart(3, '0')}`,
            name,
            status,
            origin,
            destination,
            departureDate
        };

        cargoList.push(newCargo);
        updateCargoTable();
        document.getElementById("cargo-form").reset();
    });

    updateCargoTable();

    document.getElementById("status-filter").addEventListener("change", updateCargoTable);
});
