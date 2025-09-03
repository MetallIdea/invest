import styles from './app.module.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { LoginPage } from './modules/auth/login/LoginPage';
import { NotFoundPage } from './modules/errors/NotFound';
import { TemplatesPage } from './modules/templates/TemplatesPage/TemplatesPage';
import { TemplatesFormPage } from './modules/templates/TemplatesFormPage/TemplatesFormPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { TablesPage } from './modules/tables/TablesPage/TablesPage';
import { TablesFormPage } from './modules/tables/TablesFormPage/TablesFormPage';

export function App() {
  return (
    <div className={styles.root}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className={styles.menu}>
          <Link to="/tables">Таблицы</Link>
          <Link to="/templates">Шаблоны</Link>
        </div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/templates/:id" element={<TemplatesFormPage />} />
          
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/tables/:id" element={<TablesFormPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
