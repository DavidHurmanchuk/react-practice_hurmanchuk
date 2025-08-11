/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(c => c.id === product.categoryId) || {};
    const user = usersFromServer.find(u => u.id === category.ownerId) || {};
    return { ...product, category, user };
  });

  let visibleProducts = products.slice();

  if (selectedCategoryIds.length > 0) {
    visibleProducts = visibleProducts.filter(p => p.category && selectedCategoryIds.includes(p.category.id));
  }

  if (selectedUserId !== null) {
    visibleProducts = visibleProducts.filter(p => p.user && p.user.id === selectedUserId);
  }

  if (searchTerm.trim() !== '') {
    const q = searchTerm.trim().toLowerCase();
    visibleProducts = visibleProducts.filter(p => p.name.toLowerCase().includes(q));
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection('none');
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (sortDirection !== 'none') {
    visibleProducts.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      let aValue;
      let bValue;

      switch (sortColumn) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.title.toLowerCase();
          bValue = b.category.title.toLowerCase();
          break;
        case 'user':
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return -1 * direction;
      }
      if (aValue > bValue) {
        return 1 * direction;
      }
      return 0;
    });
  }

  const resetAll = (e) => {
    e.preventDefault();
    setSelectedCategoryIds([]);
    setSelectedUserId(null);
    setSearchTerm('');
    setSortColumn('id');
    setSortDirection('asc');
  };

  const getSortIconClass = (column) => {
    if (sortColumn !== column || sortDirection === 'none') {
      return 'fas fa-sort';
    }
    return sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
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
                onClick={(e) => { e.preventDefault(); setSelectedUserId(null); }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={(e) => { e.preventDefault(); setSelectedUserId(user.id); }}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchTerm.length > 0 && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchTerm('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button mr-6 is-success ${selectedCategoryIds.length > 0 ? 'is-outlined' : ''}`}
                onClick={(e) => { e.preventDefault(); setSelectedCategoryIds([]); }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategoryIds.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={(e) => {
                    e.preventDefault();
                    if (selectedCategoryIds.includes(category.id)) {
                      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id));
                    } else {
                      setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                    }
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
            <p data-cy="NoMatchingMessage">No products matching selected criteria</p>
          ) : (
            <table data-cy="ProductTable" className="table is-striped is-narrow is-fullwidth">
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/" onClick={(e) => { e.preventDefault(); handleSort('id'); }}>
                        <span className="icon">
                          <i data-cy="SortIcon" className={getSortIconClass('id')} />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/" onClick={(e) => { e.preventDefault(); handleSort('name'); }}>
                        <span className="icon">
                          <i data-cy="SortIcon" className={getSortIconClass('name')} />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/" onClick={(e) => { e.preventDefault(); handleSort('category'); }}>
                        <span className="icon">
                          <i data-cy="SortIcon" className={getSortIconClass('category')} />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/" onClick={(e) => { e.preventDefault(); handleSort('user'); }}>
                        <span className="icon">
                          <i data-cy="SortIcon" className={getSortIconClass('user')} />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(prod => (
                  <tr key={prod.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">{prod.id}</td>
                    <td data-cy="ProductName">{prod.name}</td>
                    <td data-cy="ProductCategory">{prod.category.icon} - {prod.category.title}</td>
                    <td
                      data-cy="ProductUser"
                      className={prod.user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
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
