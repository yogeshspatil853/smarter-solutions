import React, { useCallback, useEffect } from 'react';
import useFetch from 'hooks/fetch';
import { SERVICES } from 'modules/api/endpoints';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ServiceItem from 'components/Services/ServiceItem';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

export default function Services() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const { response, performFetch } = useFetch(SERVICES);
  const { data: services, loading } = response;

  useEffect(() => {
    performFetch();
  }, []);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {(loading || !services)
          ? <Grid container justify="center">
            <CircularProgress />
          </Grid>
          : services
            .filter(({ id }, index, arr) => arr
              .findIndex(({ id: duplicateItemId }) => id === duplicateItemId) === index
            )
            .map(({ id, attributes: { name } }) => (
              <ServiceItem key={id} id={name} />
            ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={() => document.body}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </>
  )
}
