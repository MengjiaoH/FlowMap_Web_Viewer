import React, {useEffect, useState, useContext} from 'react'
import { observer } from "mobx-react";
import Store from '../../Context/RootStore'
import {AppBar} from '../../Styles/styles.js'
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const Header = () => {
    const store = useContext(Store);
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
      setOpen(true);
      store.drawerStore.DrawerOpen = true;
    };

    useEffect(() => {
        // console.log("drawer open:", store.controlStore.drawerOpen);
        setOpen(store.drawerStore.drawerOpen);
    }, [store.drawerStore.drawerOpen])

    // 2E3B55
    return (
        <AppBar position="fixed" open={open} style={{ background: '#063970' }}>

            <Toolbar>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    Interactive Lagrangian-Based Flow Visualization Tool using Deep Learning
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default observer(Header);