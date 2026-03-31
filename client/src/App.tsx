import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import Header from './components/Header';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminTest from './pages/AdminTest';
import AdminAccess from './pages/AdminAccess';
import Reservations from './pages/Reservations';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderManagement from './pages/OrderManagement';
import AdminOrderManagement from './pages/AdminOrderManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/admin-test">
            <AdminTest />
          </Route>
          <Route path="/admin-login">
            <AdminAccess />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/admin">
            <AdminDashboard />
          </Route>
          <Route path="/admin-orders">
            <AdminOrderManagement />
          </Route>
          <Route path="/reservations">
            <Reservations />
          </Route>
          <Route path="/orders">
            <OrderManagement />
          </Route>
          <Route path="/payment-success">
            <PaymentSuccess />
          </Route>
          <Route path="/payment">
            <Payment />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/menu">
            <Menu />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
