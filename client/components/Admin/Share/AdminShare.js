import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Pagination } from 'react-bootstrap'

export default class AdminShare extends React.Component {
  constructor(props) {
    super(props)

    moment.locale(navigator.userLanguage || navigator.language)

    this.state = {
      shares: [],
      pagination: {
        current: 0,
        count: 0,
        limit: 20,
      },
    }

    this.movePage = this.movePage.bind(this)
    this.renderTableBody = this.renderTableBody.bind(this)
    this.renderPagination = this.renderPagination.bind(this)
  }

  getPage(options = {}) {
    const limit = this.state.pagination.limit
    options = { ...options, limit }
    this.props.crowi
      .apiGet('/shares.list', options)
      .then(({ share: { docs: shares, page: current, pages: count } }) => {
        const pagination = { current, count, limit }
        this.setState({ shares, pagination })
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentDidMount() {
    this.getPage()
  }

  movePage(i) {
    return e => {
      e.preventDefault()
      if (i !== this.state.pagination.current) {
        this.getPage({ page: i })
      }
    }
  }

  renderStatus(isActive) {
    const className = ['label', isActive ? 'label-success' : 'label-danger'].join(' ')
    const text = isActive ? 'Active' : 'Inactive'
    return <span className={className}>{text}</span>
  }

  renderTableBody() {
    const { current, limit } = this.state.pagination
    const start = (current - 1) * limit + 1
    return (
      <tbody>
        {this.state.shares.map(({ page, creator, status, createdAt }, i) => {
          const index = start + i
          const { path } = page
          const { username } = creator
          const date = moment(createdAt).format('L')
          const isActive = status === 'active'
          return (
            <tr key={index}>
              <td>{index}</td>
              <td>{path}</td>
              <td>{username}</td>
              <td>{date}</td>
              <td>{this.renderStatus(isActive)}</td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  renderPagination() {
    const { current, count } = this.state.pagination
    const range = [...Array(count).keys()]
    console.log(count)
    const items = range.map((v, k) => {
      const page = k + 1
      const className = page === current ? 'active' : ''
      return (
        <li key={page} className={className}>
          <a onClick={this.movePage(page)}>{page}</a>
        </li>
      )
    })
    return (
      <nav>
        <ul className="pagination">
          <li className={current === 1 ? 'disabled' : ''}>
            <a onClick={this.movePage(1)}>&laquo;</a>
          </li>
          {items}
          <li className={current === count ? 'disabled' : ''}>
            <a onClick={this.movePage(count)}>&raquo;</a>
          </li>
        </ul>
      </nav>
    )
  }

  render() {
    return (
      <div>
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>ページ名</th>
              <th>作成者</th>
              <th>作成日時</th>
              <th>ステータス</th>
            </tr>
          </thead>
          {this.renderTableBody()}
        </Table>
        {this.renderPagination()}
      </div>
    )
  }
}