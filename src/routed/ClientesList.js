import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useHistory } from 'react-router-dom';
import ConfirmDialog from '../ui/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    tableRow: {
        '& button': {       // Linha da tabela em estado "normal"
            visibility: 'hidden'
        },
        '&:hover': {        // Linha da tabela com mouse sobreposto
            backgroundColor: theme.palette.action.hover
        },
        '&:hover button': { // Botões na linha com mouse sobreposto
            visibility: 'visible'
        }
    },
    toolbar: {
        justifyContent: 'flex-end',
        paddingRight: 0
    }
}));

export default function ClientesList() {
    const classes = useStyles();

    const history = useHistory()

    // É importante inicializar esta variável de estado como um vetor vazio
    const [clientes, setClientes] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deletable, setDeletable] = useState() // Cód. do registro a ser excluído
    const [snackState, setSnackState] = useState({
        open: false,
        severity: 'success',
        message: 'cliente excluído com sucesso'
    })

    function handleDialogClose(result) {
        setDialogOpen(false)
        if (result) deleteItem()
    }

    function handleDeleteClick(id) {
        setDeletable(id)
        setDialogOpen(true)
    }

    async function deleteItem() {
        try {
            await axios.delete(`https://api.faustocintra.com.br/clientes/${deletable}`)
            getData() // Atualiza os dados novamente na tabela
            setSnackState({ ...snackState, open: true }) // Exibe a snackbar de sucesso
        } catch (error) {
            // Mostra a snackbar de erro
            setSnackState({
                open: true,
                severity: 'error',
                message: 'ERRO: ' + error.message
            })
        }
    }

    async function getData() {
        try {
            let response = await axios.get('https://api.faustocintra.com.br/clientes?by=nome,cpf')
            if (response.data.length > 0) setClientes(response.data)
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getData()
    }, [])  // Quando a dependência de um useEffect é um vetor vazio, isso indica
    // que ele será executado apenas uma vez, na inicialização do componente

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleSnackClose(event, reason) {
        // Evita que a snackbar seja fechada clicando-se fora dela
        if (reason === 'clickaway') return
        setSnackState({ ...snackState, open: false }) // Fecha a snackbar
    }

    return (
        <>
            <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                Deseja realmente excluir este cliente?
			</ConfirmDialog>
            <Snackbar open={snackState.open} autoHideDuration={3000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>
            <h1>Listagem de Clientes</h1>
            <Toolbar className={classes.toolbar} >
                <Button color="secondary" variant="contained" size="large"
                    startIcon={<AddBoxIcon />} onClick={() => history.push("/new")}>
                    Novo cliente
				</Button>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow align="center">
                            <TableCell align="center">Cód.</TableCell>
                            <TableCell align="center">Nome</TableCell>
                            <TableCell align="center">CPF</TableCell>
                            <TableCell align="center">RG</TableCell>
                            <TableCell align="center">logradouro</TableCell>
                            <TableCell align="center">Número</TableCell>
                            <TableCell align="center">Complemento</TableCell>
                            <TableCell align="center">Bairro</TableCell>
                            <TableCell align="center">Município</TableCell>
                            <TableCell align="center">UF</TableCell>
                            <TableCell align="center">Telefone</TableCell>
                            <TableCell align="center">Email</TableCell>

                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">Excluir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            clientes.map(cliente =>
                                <TableRow key={cliente.id} className={classes.tableRow}>
                                    {console.log('cliente :>> ', cliente)}
                                    <TableCell align="center">
                                        <IconButton aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete" onClick={() => handleDeleteClick(cliente.id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}