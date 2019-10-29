import { makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },  
  root: {
      marginTop: theme.spacing(1)
    },
    appBar: {
      position: "relative"
    },
    toolbar: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    toolbarTitle: {
      flex: 1
    },
    mainFeaturedPost: {
      position: "relative",
      color: theme.palette.common.white,
      marginBottom: theme.spacing(4)
    },
    errorSnackbar: {
      backgroundColor: `${theme.palette.error.dark}`,
      margin: theme.spacing(1)
    },
    paper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column"
    },
    slider: {
      marginRight: theme.spacing(5),
      marginLeft: theme.spacing(2),
      display: "flex",
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1)
    }
  }));