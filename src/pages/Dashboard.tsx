import React from 'react';
import Header from '../components/Header';
import Home from '../components/Home';
import ActividadesRecreativas from '../components/ActividadesRecreativas';
import ActividadesCulturales from '../components/ActividadesCulturales';
import EventosSociales from '../components/EventosSociales';
import { Outlet, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from './Dashboard.module.css';

const DashboardShell: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<DashboardShell />}> 
          <Route index element={<Home />} />
          <Route path="actividades-recreativas" element={<ActividadesRecreativas />} />
          <Route path="actividades-culturales" element={<ActividadesCulturales />} />
          <Route path="eventos-sociales" element={<EventosSociales />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
};

export default Dashboard;
