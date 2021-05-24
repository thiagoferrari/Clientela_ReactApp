import { makeStyles, Toolbar, Typography } from "@material-ui/core";
import LocalCafeTwoToneIcon from '@material-ui/icons/LocalCafeTwoTone';

const useStyles = makeStyles((theme) => ({
    text: {
        width: '100%',
        color: theme.palette.text.secondary
    },
    toolbar: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '52px',
        // Posicinando a barra no rodapé da página:
        width: '100%',
        position: "fixed",
        bottom: 0
    },
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'none', //tira sublinhado
        '&:hover': { // mouse passando sobre link
            textDecoration: 'underline' // retorna sublinhado
        }
    }
}))

export default function FooterBar() {

    const classes = useStyles()

    return (
        <Toolbar className={classes.toolbar}>
            <Typography variant="caption" align="center" className={classes.text}>
                Desenvolvido com <LocalCafeTwoToneIcon fontSize="small" /> por <a href="malito:thiagofcjr@gmail.com" className={classes.link}>Thiago Ferrari</a>
            </Typography>
        </Toolbar>
    )
}