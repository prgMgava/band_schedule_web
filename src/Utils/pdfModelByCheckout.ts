import { ICheckout } from "../Types/checkout.type"

export const createPdfReportByCheckout = (listCheckout: ICheckout[], startDate: string, endDate: string, idsAppointments: number[]) => {
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


	listCheckout.map(checkout => {
		const currentRow: string[] = []
		/** Checkout Details - 1 Table Header: Descrição*/
		currentRow.push(checkout.description)

		/** Checkout Date- 2 Table Header: Data*/
		currentRow.push(new Date(checkout.createdAt).toLocaleDateString())

		/** Checkout Creditor Name - 3 Table Header: Type*/
		currentRow.push(checkout.creditor.name)

		/** Comercial band - 4 Table Header: Comercial*/
		currentRow.push(checkout.band.name)

		/** Custo valor - 5 Table Header: Custo operacional*/
		const valueEdited = checkout.value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).split(' ')[1]
		const checkoutType = checkout.type
		currentRow.push(checkoutType == 1 ? valueEdited : `- ${valueEdited}`)

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
					{ text: "Tel.: ", fontSize: 12, bold: true },
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
							{ text: "Detalhe", style: "tableHeader" },
							{ text: "Data", style: "tableHeader" },
							{ text: "Credor", style: "tableHeader" },
							{ text: "Banda", style: "tableHeader" },
							{ text: "Valor", style: "tableHeader" },
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