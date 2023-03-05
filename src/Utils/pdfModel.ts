import { ICheckout } from "../Types/checkout.type"

export const createPdfReport = (listCheckout: ICheckout[], startDate: string, endDate: string, idsAppointments: number[]) => {
	const { band } = listCheckout[0]
	const tableRows: any[] = []

	const sumIn = listCheckout.filter(checkout => checkout.type == 1).reduce((a, b) => {
		return a + Number(b.value)
	}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	const sumOut = listCheckout.filter(checkout => checkout.type == 2).reduce((a, b) => {
		return a + Number(b.value)
	}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	const sumProfit = (listCheckout.filter(checkout => checkout.type == 1).reduce((a, b) => {
		return a + Number(b.value)
	}, 0) - listCheckout.filter(checkout => checkout.type == 2).reduce((a, b) => {
		return a + Number(b.value)
	}, 0)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

	idsAppointments.map(idAppointment => {
		const checkoutsByAppointment = listCheckout.filter(checkout => checkout.id_appointment == idAppointment)
		const currentRow: string[] = []

		if (checkoutsByAppointment.length) {

			/** Appointment title - 1 Table Header: Evento*/
			//currentRow.push(checkoutsByAppointment[0].appointment.title)
			currentRow.push('loremadj ça asdhçf jlskdf ljasldfj lajsdlkfj lkj aldfksj')
			/** Appointment Date- 2 Table Header: Data*/
			currentRow.push(new Date(checkoutsByAppointment[0].appointment.start_date).toLocaleDateString())

			/** Checkout type = 1 - 3 Table Header: Cache*/
			const sumEntrance = checkoutsByAppointment?.filter(checkout => checkout.type == 1).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumEntrance)

			/** Comercial creditor - 4 Table Header: Comercial*/
			const sumComercial = checkoutsByAppointment.filter(checkout => checkout.creditor?.name.toLowerCase() == 'comercial').filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumComercial)

			/** Batera creditor - 5 Table Header: Batera*/
			const sumDrummer = checkoutsByAppointment.filter(checkout => checkout.creditor?.name.toLowerCase() == 'baterista').filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumDrummer)

			/** Percussion - 6 Table Header: Percussão*/
			const sumPercussion = checkoutsByAppointment.filter(checkout => checkout.creditor?.name.toLowerCase() == 'percussão').filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumPercussion)

			/** Guitar - 7 Table Header: Violão*/
			const sumGuitar = checkoutsByAppointment.filter(checkout => checkout.creditor?.name.toLowerCase() == 'violão').filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumGuitar)

			/** Bass - 8 Table Header: Baixo*/
			const sumBass = checkoutsByAppointment.filter(checkout => checkout.creditor?.name.toLowerCase() == 'baixo').filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumBass)

			/** Staff - 9 Table Header: Operador staff*/
			const sumStaff = checkoutsByAppointment.filter(checkout => checkout.creditor?.name.toLowerCase() == 'operador staff').filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumStaff)

			/** Staff - 10 Table Header: Operador staff*/
			const sumOthers = checkoutsByAppointment.filter(checkout => checkout.creditor?.name.toLowerCase() == 'outros').filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumOthers)

			/** Entradas - 11 Table Header: Entradas*/
			const sumEntry = checkoutsByAppointment.filter(checkout => checkout.type == 1).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumEntry)

			/** Saídas - 12 Table Header: Saídas*/
			const sumOut = checkoutsByAppointment.filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
			currentRow.push(sumOut)

			/** Profit - 13 Table Header: Lucro*/

			const profit = checkoutsByAppointment.filter(checkout => checkout.type == 1).reduce((a, b) => {
				return a + Number(b.value)
			}, 0) - checkoutsByAppointment.filter(checkout => checkout.type == 2).reduce((a, b) => {
				return a + Number(b.value)
			}, 0)


			currentRow.push(profit.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1])

		}
		tableRows.push(currentRow.map(row => {
			return row == "R$ 0,00" ? '--' : row
		}))
	})

	return {
		pageOrientation: "landscape",
		content: [
			{
				text: "Redbus Produções",
				style: "header",
			},
			{
				text: [
					{ text: "CNPJ: ", fontSize: 12, bold: true },
					"48866171/0001-24    ",
					{ text: "Email: ", fontSize: 12, bold: true },
					"redbusproducoes@gmail.com    ",
					{ text: "Tel.:", fontSize: 12, bold: true },
					"(61) 9533-1001",
				],
			},
			{
				text: [
					{ text: "Banda: ", fontSize: 12, bold: true },
					band?.name + "    ",
					{ text: "Período: ", fontSize: 12, bold: true },
					`${new Date(startDate + "T03:00:00").toLocaleDateString()} - ${new Date(endDate + "T03:00:00").toLocaleDateString()}    \n\n\n`,
				],
			},
			{
				style: "tableExample",
				table: {
					headerRows: 1,
					body: [
						[
							{ text: "Evento", style: "tableHeader" },
							{ text: "Data", style: "tableHeader" },
							{ text: "Cache", style: "tableHeader" },
							{ text: "Comercial", style: "tableHeader" },
							{ text: "Batera", style: "tableHeader" },
							{ text: "Percussão", style: "tableHeader" },
							{ text: "Violão", style: "tableHeader" },
							{ text: "Baixo", style: "tableHeader" },
							{ text: "Staff", style: "tableHeader" },
							{ text: "Outros", style: "tableHeader" },
							{ text: "Entradas", style: "tableHeader" },
							{ text: "Saídas", style: "tableHeader" },
							{ text: "Lucro", style: "tableHeader" },
						],
						...tableRows
					],
				},
				layout: {
					fillColor: function (rowIndex, node, columnIndex) {
						return rowIndex % 2 === 0 ? "#CCCCCC" : null
					},
				},
			},
			{ text: ['\n\n'] },
			{
				text: [
					{ text: "Total de entradas: ", fontSize: 12, bold: true },
					`${sumIn}\n`,
					{ text: "Total de saídas: ", fontSize: 12, bold: true },
					`${sumOut}\n`,
					{ text: "Lucro:", fontSize: 12, bold: true },
					`${sumProfit}\n`,
				]
			},
		],

		styles: {
			header: {
				fontSize: 16,
				bold: true,
			},
			anotherStyle: {
				italics: true,
				alignment: "right",
			},
		},
	}
}