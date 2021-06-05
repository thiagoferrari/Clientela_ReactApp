import { useEffect, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import MuiAlert from '@material-ui/lab/Alert';
import ConfirmDialog from '../ui/ConfirmDialog'
import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import InputMask from 'react-input-mask'
import LinearProgress from '@material-ui/core/LinearProgress'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    h1: {
        marginBottom: '42px'
    },
    form: {
        maxWidth: '80%',
        margin: '0 auto',
        display: "flex",
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        '& .MuiFormControl-root': {
            minWidth: '200px',
            maxWidth: '500px',
            marginBottom: '24px',
        },
        '& Button': {
            height: '42px',
            width: '120px',
            marginLeft: '120px',
        }
    },
    toolbar: {
        justifyContent: 'space-between',
        paddingRight: 0,
        margin: theme.spacing(2, 0)
    },
    loading: {
        textAlign: 'center'
    }
}))

const formatChars = {
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]'
}
const cpfMask = '000.000.000-00'
const celMask = '(00) 00000-0000'

export default function ClienteForm() {

    const classes = useStyles()

    const [cliente, setCliente] = useState({
        id: null,
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
        email: ''
    })

    const [snackState, setSnackState] = useState({
        open: false,
        severity: 'success',
        message: 'Registro salvo com sucesso'
    })

    const [btnSendState, setBtnSendState] = useState({
        disabled: false,
        label: 'Enviar'
    })

    const [dialogOpen, setDialogOpen] = useState(false)
    const [isModified, setIsModified] = useState(false)

    const [UF, setUF] = useState([])

    const history = useHistory()
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            getData(params.id)
        }
        getEstados()
    }, [])

    async function getData(id) {
        try {
            let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)
            setCliente(response.data)
        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'Não foi possível carregar os dados para edição.'
            })
        }
    }


    async function getEstados(idBrasil = 3469034) {

        /* vamos obter de uma API pública os estados do Brasil */
        try {
            let response = await axios.get(`http://www.geonames.org/childrenJSON?geonameId=${idBrasil}`)
            response.data.geonames.map(estado => setUF(old => [...old, (estado.adminCodes1.ISO3166_2)]))
        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'Erro ao obter estados do Brasil, tente novamente mais tarde!'
            })
        }
    }

    function years() {
        let result = []
        for (let i = (new Date()).getFullYear(); i >= 1900; i--) result.push(i)
        return result
    }

    function handleInputChange(event, property) {

        if (event.target.id) property = event.target.id

        if (
            property === 'rg' ||
            property === 'num_imovel'
        ) {
            setCliente({
                ...cliente, [property]: event.target.value.toUpperCase()
                    // nao aceita o primeiro caractere como espaço
                    .replace(/^\s+/, '')
            })
        }

        else if (
            property === 'nome' ||
            property === 'municipio'
        ) {
            setCliente({
                ...cliente, [property]: event.target.value.toLowerCase()
                    // nao aceita caracteres especiais e nem números
                    .replace(/["'~`!@#$%^&()_={}[\]:;,.<>+/?-]+|\d+|^\s+$/g, '')
                    // primeira letra de cada palavra maiúscula
                    .replace(/(?:^|\s)\S/g, (value) => {
                        return value.toUpperCase()
                    })
            })
        }
        else if (
            property === 'logradouro' ||
            property === 'bairro'
        ) {
            setCliente({
                ...cliente, [property]: event.target.value.toLowerCase()
                    // nao aceita caracteres especiais, porem aceita números
                    .replace(/["'~`!@#$%^&()_={}[\]:;,.<>+/?-]+|^\s+$/g, '')
                    // primeira letra de cada palavra maiúscula
                    .replace(/(?:^|\s)\S/g, (value) => {
                        return value.toUpperCase()
                    })
            })
        }
        else if (property === 'complemento') {
            setCliente({
                ...cliente, [property]: event.target.value
                    // nao aceita caracteres especiais, porem aceita números
                    .replace(/["'~`!@#$%^&()_={}[\]:;,.<>+/?-]+|^\s+$/g, '')
                    // primeira letra da primeira palavra maiúscula
                    .replace(/^\w/, (value) => {
                        // .replace(/(?:^|\s)\S/g, (value) => {
                        return value.toUpperCase()
                    })
            })
        }
        else {
            setCliente({ ...cliente, [property]: event.target.value })
        }
        setIsModified(true)
    }

    async function saveData() {
        try {
            setBtnSendState({ disabled: true, label: 'Enviando...' })

            if (params.id) await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, cliente)
            else await axios.post('https://api.faustocintra.com.br/clientes', cliente)

            setSnackState({
                open: true,
                severity: 'success',
                message: 'Registro salvo com sucesso!'
            })
        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'ERRO: ' + error.message
            })
        }
        setBtnSendState({ disabled: false, label: 'Enviar' })
    }

    function handleSubmit(event) {
        event.preventDefault()
        saveData()
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleSnackClose(event, reason) {
        if (reason === 'clickaway') return
        setSnackState({ ...snackState, open: false })

        history.push('/list')
    }

    function handleDialogClose(result) {
        setDialogOpen(false)

        if (result) history.push('/list')
    }

    function handleGoBack() {
        if (isModified) setDialogOpen(true)
        else history.push('/list')
    }

    if (UF.length !== 27) {
        return (
            <>
                <h1 className={classes.loading}>Carregando Formulário</h1>
                <LinearProgress />
            </>
        )
    } else {

        return (
            <>
                <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                    Os dados inseridos serão perdidos, deseja realmente voltar?
                </ConfirmDialog>

                <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
                    <Alert onClose={handleSnackClose} severity={snackState.severity}>
                        {snackState.message}
                    </Alert>
                </Snackbar>

                <Toolbar className={classes.toolbar}>
                    <h1>Novo cadastro</h1>
                </Toolbar>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        id="nome"
                        label="Insira o Nome"
                        fullWidth
                        required
                        variant="filled"
                        value={cliente.nome}
                        inputProps={{ maxLength: 100 }}
                        onChange={handleInputChange}
                    />
                    <InputMask
                        id="cpf"
                        formatChars={formatChars}
                        mask={cpfMask}
                        value={cliente.cpf}
                        onChange={event => handleInputChange(event, 'cpf')}
                    >
                        {() => <TextField label="Insira o CPF" variant="filled" required fullWidth />}
                    </InputMask>
                    <TextField
                        id="rg"
                        label="Insira o RG"
                        type="text"
                        fullWidth
                        required
                        variant="filled" value={cliente.rg}
                        inputProps={{ maxLength: 20 }}
                        onChange={handleInputChange}
                    />
                    <TextField
                        id="logradouro"
                        label="Insira o Logradouro"
                        fullWidth
                        required
                        variant="filled"
                        value={cliente.logradouro}
                        inputProps={{ maxLength: 100 }}
                        onChange={handleInputChange}
                    />
                    <TextField
                        id="num_imovel"
                        label="Insira o Número"
                        fullWidth
                        required
                        variant="filled"
                        value={cliente.num_imovel}
                        inputProps={{ maxLength: 10 }}
                        onChange={handleInputChange}
                    />
                    <TextField
                        id="complemento"
                        label="Insira o Complemento"
                        variant="filled"
                        fullWidth
                        value={cliente.complemento}
                        inputProps={{ maxLength: 30 }}
                        onChange={handleInputChange}
                    />
                    <TextField
                        id="bairro"
                        label="Insira o Bairro"
                        fullWidth
                        required
                        variant="filled"
                        value={cliente.bairro}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleInputChange}
                    />
                    <TextField
                        id="municipio"
                        label="Insira o Município"
                        fullWidth
                        required
                        variant="filled"
                        value={cliente.municipio}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleInputChange}
                    />
                    <TextField
                        id="uf" label="Insira a UF"
                        fullWidth
                        required
                        select
                        variant="filled"
                        value={cliente.uf}
                        onChange={event => handleInputChange(event, 'uf')}
                    >
                        {UF.map(estado => <MenuItem value={estado} key={estado}>{estado}</MenuItem>)}
                    </TextField>
                    <InputMask
                        id="telefone"
                        formatChars={formatChars}
                        mask={celMask}
                        value={cliente.telefone}
                        onChange={event => handleInputChange(event, 'telefone')}
                    >
                        {() => <TextField label="Insira o Telefone (Celular)" variant="filled" fullWidth required />}
                    </InputMask>
                    <TextField
                        id="email"
                        label="Insira o Email"
                        type="email"
                        placeholder="email@exemplo.com"
                        fullWidth
                        required
                        variant="filled"
                        value={cliente.email}
                        inputProps={{ maxLength: 100 }}
                        onChange={handleInputChange}
                    />
                    <Toolbar className={classes.toolbar}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={btnSendState.disabled}
                        >
                            {btnSendState.label}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleGoBack}
                        >
                            Voltar
                    </Button>
                    </Toolbar>

                </form>
            </>
        )
    }
}