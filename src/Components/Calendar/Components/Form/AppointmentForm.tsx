import * as React from 'react';

import { Grid } from "@mui/material"

import {useForm, SubmitHandler} from 'react-hook-form'
import { IAppointmentFields } from '../../../../Types/form.type';
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({	
	title: yup.string().required('Nome do evento é obrigatório').max(100, 'Nome muito grande'),
	cellphone: yup.string().required('Telefone do responsável é obrigatório').max(50, 'Telefone muito grande'),
	street: yup.string().max(50, 'Nome de rua muito grande'),
	district: yup.string().max(50, 'Nome de bairro muito grande'),
	state: yup.string(),
	city: yup.string().max(50, 'Nome de cidade muito grande'),
	place: yup.string().max(50, 'Nome muito grande'),
	house_number: yup.string().max(10, 'Numero muito grande'),
	address_complement: yup.string().max(150, 'Complemento muito grande'),
	address: yup.boolean().when(['street', 'state'], {
		is: (a,b) => a || b,
		then: yup.boolean().nullable(),
		otherwise: yup.boolean().notOneOf([false], 'Forneça algum endereço')
	}),
	status: yup.string(),
	id_band: yup.number().required('Informe a banda que vai tocar no evento'),
	startDate: yup.date().required('Data inicial obrigatória'),
	endDate: yup.date().required('Data final obrigatória'),
})

export const AppointmentForm = () => {
	const {register, handleSubmit, watch, formState: { errors}} = useForm<IAppointmentFields>()

	const submitForm: SubmitHandler<IAppointmentFields> = (data: IAppointmentFields) => {
		console.log(data)
	}

	return (
		<Grid>
			<form onSubmit={handleSubmit(submitForm)}>

			</form>
		</Grid>
	)
}