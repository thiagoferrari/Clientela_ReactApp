import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LocalCafeTwoToneIcon from '@material-ui/icons/LocalCafeTwoTone'

const useStyles = makeStyles((theme) => ({
	text: {
        width: '100%',
        color: theme.palette.text.secondary,
    },
    toolbar: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '42px',
        bottom: 0,
        width: '100%',
        position: 'fixed',
        zIndex: 10
    },
    link: {
        color: theme.palette.secondary.light,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

export default function FooterBar() {
    const classes = useStyles();

    return (
        <Toolbar className={classes.toolbar}>
            <Typography 
                className={classes.text} 
                variant="caption" 
                align="center"
            >
                Desenvolvido com <LocalCafeTwoToneIcon fontSize="small" /> por <a className={classes.link} 
                href="https://github.com/vimarteleto" target="_blank" rel="noreferrer">Thiago</a>
            </Typography>
        </Toolbar>
    )
}