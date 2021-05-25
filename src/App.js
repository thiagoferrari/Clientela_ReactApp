import TopBar from './ui/TopBar';
import FooterBar from './ui/FooterBar'
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import red from '@material-ui/core/colors/red';
import { Box } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ClientesList from './routed/ClientesList';
import ClientesForm from './routed/ClientesForm';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: cyan[500],
        },
        secondary: {
            main: red[500],
        },
    },
})

const useStyles = makeStyles((theme) => ({
    box: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh', // 100% da altura visível
        paddingBottom: '42px' //para que o conteúdo não fique escondido atrás do footer
    },
    routed: {
        padding: '24px',
        color: theme.palette.text.primary,
        fonFamily: theme.typography.fontFamily
    }
}))

function Main() {
    const classes = useStyles()
    return (
        <Box className={classes.box}>
            <BrowserRouter>
                <TopBar />
                <Box id='routed' className={classes.routed}>
                    <Switch>
                        <Route path="/list">
                            <ClientesList />
                        </Route>
                        <Route path="/new">
                            <ClientesForm />
                        </Route>
                    </Switch>
                </Box>
                <FooterBar />
            </BrowserRouter>
        </Box>
    )
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Main />
        </ThemeProvider>
    );
}

export default App;
