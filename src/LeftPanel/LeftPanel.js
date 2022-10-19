import React, {useState, useContext, useEffect} from 'react'
import { observer } from "mobx-react";
import {useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import {DrawerHeader, drawerWidth} from '../Styles/styles.js'
import Header from './components/Header'
import Store from '../Context/RootStore'
import ModelLoader from './components/ModelLoader';
import InfoTap from './components/InfoTap';
import PipelineTap from './components/PipelineTap'
import Filter from './components/Filter'
import SeedPlacement from './components/SeedPlacement';
import ColorOptions from './components/ColorOptions';
import ParticleTracing from './components/ParticleTracing';

const LeftPanel = () => {
    const store = useContext(Store);
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [value, setValue] = React.useState('1');

    const handleTapChange = (event, newValue) => {
        setValue(newValue);
    };


    // Control Drawer Open
    useEffect(() => {
      setOpen(store.drawerStore.drawerOpen);
    }, [store.drawerStore.drawerOpen])

    // Control Drawer Close 
    const handleDrawerClose = () => {
        setOpen(false);
        store.drawerStore.DrawerOpen = false;
    };



  return (
     <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* Header and Drawer Trigger */} 
        <Header/>

        {/* Start the Drawer*/}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          {/* Close Left Arrow Icon */}
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>

          <Divider/>

          <ModelLoader/>

          <Divider/>

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleTapChange} aria-label="lab API tabs example">
                    <Tab label="Tools" value="1" wrapped />
                    <Tab label="Pipeline Browser" value="2" wrapped/>
                    <Tab label="Information" value="3" wrapped/>
                </TabList>
                </Box>
                <TabPanel value="1">
                    <Filter/>
                    <Divider/>
                    <SeedPlacement/>
                    <ColorOptions/>
                    <ParticleTracing/>
                </TabPanel>
                <TabPanel value="2">
                    <PipelineTap/>
                </TabPanel>
                <TabPanel value="3">
                    <InfoTap/>
                </TabPanel>
            </TabContext>
        </Box>


        </Drawer>
      </Box>
  )
}

export default observer(LeftPanel)