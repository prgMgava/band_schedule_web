export const data = [
	{
		"status": 'concluido',
		"id": 21,
		"title": "My first Event",
		"cellphone": "(12) 12345-6789",
		"id_band": 1,
		"startDate": "2022-10-16T09:12:12.000Z",
		"endDate": "2022-10-16T10:12:12.000Z",
		"street": "Rua Alfa",
		"district": "Zona X",
		"state": "ES",
		"city": "São Mateus",
		"place": "Radio Amanhecer",
		"address_number": "05",
		"address_complement": null,
		"duration": 1,
		"updatedAt": "2022-10-16T20:17:47.338Z",
		"createdAt": "2022-10-16T20:17:47.338Z",
		"band": {
			"id": 24,
			"name": "AC/DC",
			"email": "$2b$10$9nYwfECYGhHPyBiKjPO81OWc0gEmDxVxmI.NvlPPEyFMXHB4pC.Y6",
			"cellphone": "27123456789",
			"status": true,
			"createdAt": "2022-10-16T13:05:38.309Z",
			"updatedAt": "2022-10-16T13:59:14.147Z",
			"owner": 2
		}
	}, {
		title: 'Book Flights to San Fran for Sales Trip',
		priorityId: 1,
		"startDate": "2022-10-18T09:12:12.000Z",
		"endDate": "2022-10-18T10:12:12.000Z",
		street: 'Rua dos Bobos',
		status: 'agendado',
		band: 'AC/DC',
		id: 1,
	}, {
		title: 'Install New Router in Dev Room',
		priorityId: 3,
		"startDate": "2022-10-25T09:12:12.000Z",
		"endDate": "2022-10-25T10:12:12.000Z",
		street: 'Rua dos Bobos',
		status: 'cancelado',
		band: 'AC/DC',
		id: 2,
	}, {
		title: 'New Brochures',
		priorityId: 2,
		startDate: new Date(2018, 4, 7, 13, 0),
		endDate: new Date(2018, 4, 7, 15, 15),
		street: 'Rua dos Bobos',
		status: 'concluido',
		band: 'AC/DC',
		id: 4,
	},];

export const bandList = [
	{ value: 1, name: 'Banda 1' },
	{ value: 2, name: 'Banda 2' },
	{ value: 3, name: 'Banda 3' }
]

export const admList = [
	{ value: 1, name: 'Usuario 1' },
	{ value: 2, name: 'Usuario 2' },
	{ value: 3, name: 'Usuario 3' }
]
