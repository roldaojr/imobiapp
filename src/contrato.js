import React from 'react'
import {
    Datagrid, List, Responsive, SimpleList, TextField, DateField, Labeled,
    NumberField, BooleanField, FunctionField, ShowButton, EditButton, Filter,
    Create, Edit, SimpleForm, SelectInput, DateInput, BooleanInput,
    NumberInput, ReferenceField, ReferenceManyField, ReferenceInput,
    SimpleShowLayout, Show, required, minValue, maxValue
} from 'react-admin'
import { default as MuiList } from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ReciboButton from './recibo/button'

const situacao = (r) => {
    if(r.pago) return "Pago"
    return (new Date(r.vencimento).toDateString() < new Date().toDateString()) ? "Vencido" : "Pendente"
}

const ListFilter = (props) => (
    <Filter {...props}>
        <BooleanInput source="ativo" />
    </Filter>
)

export const list = (props) => (
    <List {...props} title="Contratos" filters={<ListFilter/>} defaultValues={{ativo: true}}>
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
                    </ReferenceField>)}
                tertiaryText={record => (<DateField label="Data" source="data" record={record}/>)}/>
            }
            medium={
                <Datagrid>
                    <ReferenceField reference="Inquilino" source="inquilino" linkType={false}>
                        <TextField source="nome"/>
                    </ReferenceField>
                    <ReferenceField reference="Imovel" source="imovel" linkType={false}>
                        <TextField source="descricao"/>
                    </ReferenceField>
                    <DateField label="Data" source="data"/>
                    <TextField source="duracao" label="Duração"/>
                    <BooleanField source="ativo"/>
                    <ShowButton/>
                    <EditButton/>
                </Datagrid>
            }
        />
    </List>
)

export const create = (props) => (
    <Create {...props} title="Novo Contrato">
        <SimpleForm redirect="show" defaultValue={{
            data: new Date(), dia_vencimento: 1, valor_mensal: 0.00, ativo: true
        }}>
            <ReferenceInput reference="Inquilino" source="inquilino" validate={required()} fullWidth >
                <SelectInput optionText="nome"/>
            </ReferenceInput>
            <ReferenceInput reference="Imovel" source="imovel" validate={required()} fullWidth >
                <SelectInput optionText="descricao"/>
            </ReferenceInput>
            <DateInput source="data" validate={required()} fullWidth />
            <NumberInput source="duracao" label="Duração (meses)" validate={[required(), minValue(1)]} fullWidth />
            <NumberInput source="dia_vencimento" label="Dia do vencimento do aluguel" validate={[required(), minValue(1), maxValue(31)]} fullWidth />
            <NumberInput source="valor_mensal" label="Valor mensal do aluguel" validate={[required(), minValue(0)]} fullWidth />
        </SimpleForm>
    </Create>
)

export const edit = (props) => (
    <Edit {...props} title="Editar Contrato">
        <SimpleForm redirect="show">
            <DateInput source="data" fullWidth />
            <NumberInput source="duracao" label="Duração (meses)" fullWidth />
            <NumberInput source="dia_vencimento" label="Dia do vencimento do aluguel" fullWidth />
            <NumberInput source="valor_mensal" label="Valor mensal do aluguel" fullWidth />
            <BooleanInput source="ativo" fullWidth />
        </SimpleForm>
    </Edit>
)

const ParcelaList = ({ ids, data, basePath, styles }) => (
    <MuiList style={{display: 'block'}}>
        {ids.map(id => (
            <ListItem key={id}>
                <ListItemText primary={
                    <div>
                        <DateField source="vencimento" record={data[id]}/>
                    </div>
                } secondary={
                    <div>
                        <NumberField source="valor" options={{ style: 'currency', currency: 'BRL' }} record={data[id]}/>
                        <FunctionField render={situacao} record={data[id]}/>
                    </div>
                }
                />
                <ListItemSecondaryAction>
                  <EditButton record={data[id]}/>
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
            <DateField source="data"/>
            <NumberField source="duracao" label="Duração (meses)"/>
            <NumberField source="dia_vencimento" label="Dia do vencimento do aluguel"/>
            <NumberField source="valor_mensal" options={{ style: 'currency', currency: 'BRL' }} label="Valor mensal do aluguel"/>
            <BooleanField source="ativo"/>
            <ReferenceManyField addLabel={false} reference="Parcela" target="contrato" style={{ width: '99%' }}>
                <Labeled fullWidth label="Parcelas">
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
                </Labeled>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
)

export default {list, create, edit, show}
