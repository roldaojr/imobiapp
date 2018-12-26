import React from 'react'
import {
    Datagrid, List, Responsive, SimpleList, TextField,  DateField,
    NumberField, BooleanField, FunctionField, ShowButton, EditButton,
    Create, Edit, SimpleForm, TextInput, SelectInput, DateInput, BooleanInput,
    NumberInput, ReferenceField, ReferenceManyField, ReferenceInput,
    SimpleShowLayout, Show
} from 'react-admin'
import { default as MuiList } from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ReciboButton from './recibo/button'

const situacao = (r) => {
    if(r.pago) return "Pago"
    return (new Date(r.vencimento) < new Date()) ? "Vencido" : "Pendente"
}

export const list = (props) => (
    <List {...props} title="Contratos">
        <Responsive
            small={
                <SimpleList linkType="show"
                primaryText={record => (
                    <ReferenceField label="Descrição" source="imovel" reference="Imovel" basePath="imovel" linkType={false} record={record}>
                        <TextField source="descricao" />
                    </ReferenceField>)}
                secondaryText={record => (
                    <ReferenceField label="Inquilino" source="inquilino" reference="Inquilino" basePath="inquilino" linkType={false} record={record}>
                        <TextField source="nome" />
                    </ReferenceField>)}/>
            }
            medium={
                <Datagrid>
                    <TextField source="numero"/>
                    <ReferenceField reference="Inquilino" source="inquilino" linkType={false}>
                        <TextField source="nome"/>
                    </ReferenceField>
                    <ReferenceField reference="Imovel" source="imovel" linkType={false}>
                        <TextField source="descricao"/>
                    </ReferenceField>
                    <TextField source="duracao" label="Duração"/>
                    <BooleanField source="ativo"/>
                    <ShowButton/>
                </Datagrid>
            }
        />
    </List>
)

const form = (
    <SimpleForm redirect="show">
        <ReferenceInput reference="Inquilino" source="inquilino">
            <SelectInput optionText="nome"/>
        </ReferenceInput>
        <ReferenceInput reference="Imovel" source="imovel">
            <SelectInput optionText="descricao"/>
        </ReferenceInput>
        <DateInput source="data_inicio" label="Data início"/>
        <NumberInput source="duracao" label="Duração (meses)"/>
        <NumberInput source="dia_vencimento" label="Dia do vencimento do aluguel"/>
        <NumberInput source="valor_mensal" label="Valor mensal do aluguel"/>
    </SimpleForm>
)

export const create = (props) => (
    <Create {...props} title="Novo Contrato">
        {form}
    </Create>
)

export const edit = (props) => (
    <Edit {...props} title="Editar Contrato">
        <SimpleForm redirect="show">
            <NumberInput source="dia_vencimento" label="Dia do vencimento do aluguel"/>
            <NumberInput source="valor_mensal" label="Valor mensal do aluguel"/>
            <BooleanInput source="ativo"/>
        </SimpleForm>
    </Edit>
)

const ParcelaList = ({ ids, data, basePath }) => (
    <MuiList>
        {ids.map(id => (
            <ListItem key={id}>
                <ListItemText primary={
                    <div>
                        <DateField source="vencimento" record={data[id]}/>
                        <span style={{float: 'right', opacity: 0.541176}}>
                            <FunctionField render={situacao} record={data[id]}/>
                        </span>
                    </div>
                } secondary={
                    <NumberField source="valor" options={{ style: 'currency', currency: 'BRL' }} record={data[id]}/>
                }
                />
                <ListItemSecondaryAction>
                  <ReciboButton record={data[id]}/>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </MuiList>
)

export const show = (props) => (
    <Show {...props} title="Ver Contrato">
        <SimpleShowLayout>
            <TextField source="id"/>
            <ReferenceField reference="Inquilino" source="inquilino" linkType={false}>
                <TextField source="nome"/>
            </ReferenceField>
            <ReferenceField reference="Imovel" source="imovel" linkType={false}>
                <TextField source="descricao"/>
            </ReferenceField>
            <NumberField source="duracao" label="Duração (meses)"/>
            <NumberField source="dia_vencimento" label="Dia do vencimento do aluguel"/>
            <NumberField source="valor_mensal" options={{ style: 'currency', currency: 'BRL' }} label="Valor mensal do aluguel"/>
            <BooleanField source="ativo"/>
            <ReferenceManyField label="Parcelas" reference="Parcela" target="contrato">
                <Responsive
                    small={
                        <ParcelaList/>
                    }
                    medium={
                        <Datagrid>
                            <DateField source="vencimento"/>
                            <NumberField source="valor" options={{ style: 'currency', currency: 'BRL' }} />
                            <FunctionField label="Situação" render={situacao}/>
                            <BooleanField source="pago"/>
                            <EditButton/>
                            <ReciboButton/>
                        </Datagrid>
                    }
                />
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
)

export default {list, create, edit, show}
