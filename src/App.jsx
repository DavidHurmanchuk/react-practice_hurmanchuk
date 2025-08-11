/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');

  const products = productsFromServer.map(product => {
    const category =
      categoriesFromServer.find(c => c.id === product.categoryId) || {};
    const user = usersFromServer.find(u => u.id === category.ownerId) || {};

    return { ...product, category, user };
  });

  let visibleProducts = products.slice();

  if (selectedCategoryId !== null) {
    visibleProducts = visibleProducts.filter(
      p => p.category && p.category.id === selectedCategoryId,
    );
  }

  if (selectedUserId !== null) {
    visibleProducts = visibleProducts.filter(
      p => p.user && p.user.id === selectedUserId,
    );
  }

  if (searchTerm.trim() !== '') {
    const q = searchTerm.trim().toLowerCase();

    visibleProducts = visibleProducts.filter(p =>
      p.name.toLowerCase().includes(q),
    );
  }

  const resetAll = e => {
    e.preventDefault();
    setSelectedCategoryId(null);
    setSelectedUserId(null);
    setSearchTerm('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === null ? 'is-active' : ''}
                onClick={e => {
                  e.preventDefault();
                  setSelectedUserId(null);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={e => {
                    e.preventDefault();
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setSearchTerm('')}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button mr-6 is-outlined ${selectedCategoryId === null ? 'is-success' : ''}`}
                onClick={e => {
                  e.preventDefault();
                  setSelectedCategoryId(null);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategoryId === category.id ? 'is-info' : ''}`}
                  href="#/"
                  onClick={e => {
                    e.preventDefault();
                    setSelectedCategoryId(category.id);
                  }}
                >
                  {category.icon} - {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(prod => (
                  <tr key={prod.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {prod.id}
                    </td>
                    <td data-cy="ProductName">{prod.name}</td>
                    <td data-cy="ProductCategory">
                      {prod.category.icon} - {prod.category.title}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        prod.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {prod.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
