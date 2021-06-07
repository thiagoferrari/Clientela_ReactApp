import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import ConfirmDialog from '../ui/ConfirmDialog'
import Paper from '@material-ui/core/Paper'
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import { DataGrid } from '@material-ui/data-grid'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    dataGrid: {
        '& .MuiDataGrid-row button': {
            visibility: 'hidden'
        },
        '& .MuiDataGrid-row:hover button': {
            visibility: 'visible'
        }
    },
    toolbar: {
        justifyContent: 'space-between',
        paddingRight: 0,
        margin: theme.spacing(2, 0)
    }
}))

export default function ClienteList() {
    const classes = useStyles()

    const [clientes, setClientes] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deletable, setDeletable] = useState()

    const [snackState, setSnackState] = useState({
        open: false,
        severity: 'success',
        message: 'Registro excluído com sucesso'
    })

    const history = useHistory()

    useEffect(() => {
        setTimeout(() => getData(), 100)
    }, [])

    async function getData() {
        try {
            let response = await axios.get('https://api.faustocintra.com.br/clientes?by=nome')
            if (response.data.length > 0) setClientes(response.data)
        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'ERRO: ' + error.message
            })
        }
    }

    async function deleteItem() {
        try {
            await axios.delete(`https://api.faustocintra.com.br/clientes/${deletable}`)
            getData()
            setSnackState({ ...snackState, open: true })
        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'ERRO: ' + error.message
            })
        }
    }

    function handleDialogClose(result) {
        setDialogOpen(false)
        if (result) deleteItem()
    }

    function handleDelete(id) {
        setDeletable(id)
        setDialogOpen(true)
    }


    function handleSnackClose(event, reason) {
        if (reason === 'clickaway') return
        setSnackState({ ...snackState, open: false })
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const columns = [
        {
            field: 'id',
            headerName: 'Cód.',
            align: 'right',
            headerAlign: 'right',
            width: 90
        },
        {
            field: 'nome',
            headerName: 'Nome',
            align: 'left',
            headerAlign: 'left',
            width: 200
        },
        {
            field: 'cpf',
            headerName: 'CPF',
            align: 'right',
            headerAlign: 'center',
            width: 120,
            sortable: false
        },
        {
            field: 'rg',
            headerName: 'RG',
            align: 'right',
            headerAlign: 'center',
            width: 120,
            sortable: false
        },
        {
            field: 'logradouro',
            headerName: 'Logradouro',
            align: 'left',
            headerAlign: 'left',
            width: 200,
            sortable: false
        },
        {
            field: 'num_imovel',
            headerName: 'Nº',
            align: 'right',
            headerAlign: 'center',
            width: 80,
            sortable: false
        },
        {
            field: 'complemento',
            headerName: 'Complemento',
            align: 'left',
            headerAlign: 'left',
            width: 180,
            sortable: false
        },
        {
            field: 'bairro',
            headerName: 'Bairro',
            align: 'left',
            headerAlign: 'left',
            width: 150,
            sortable: false
        },
        {
            field: 'municipio',
            headerName: 'Município',
            align: 'left',
            headerAlign: 'left',
            width: 150
        },
        {
            field: 'uf',
            headerName: 'UF',
            align: 'center',
            headerAlign: 'center',
            width: 80
        },
        {
            field: 'telefone',
            headerName: 'Telefone',
            align: 'right',
            headerAlign: 'left',
            width: 150,
            sortable: false
        },
        {
            field: 'email',
            headerName: 'Email',
            align: 'left',
            headerAlign: 'left',
            width: 200,
            sortable: false
        },
        {
            field: 'editar',
            headerName: 'Editar',
            align: 'center',
            headerAlign: 'center',
            width: 80,
            sortable: false,
            renderCell: params => (
                <IconButton aria-label="editar" onClick={() => history.push(`/edit/${params.id}`)}>
                    <EditIcon color="primary" />
                </IconButton>
            )
        },
        {
            field: 'excluir',
            headerName: 'Excluir',
            align: 'center',
            headerAlign: 'center',
            width: 80,
            sortable: false,
            renderCell: params => (
                <IconButton aria-label="excluir" onClick={() => handleDelete(params.id)}>
                    <DeleteIcon color="error" />
                </IconButton>
            )
        },
    ]

    return (
        <>
            <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                Realmente deseja excluir este registro?
            </ConfirmDialog>

            <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>

            <Toolbar className={classes.toolbar}>
                <h1>Listagem de clientes</h1>
                <Button color="primary" variant="contained" size="large"
                    startIcon={<AddIcon />} onClick={() => history.push('/new')}>
                    Novo Cadastro
                </Button>
            </Toolbar>
            <Paper elevation={4}>
                <DataGrid
                    className={classes.dataGrid}
                    rows={clientes}
                    columns={columns}
                    pageSize={10}
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    disableColumnMenu={true}
                />
            </Paper>
        </>
    )
}