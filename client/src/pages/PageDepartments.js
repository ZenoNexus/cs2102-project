import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AddDepartment from '../components/PageDepartments/AddDepartment'
import AdminSidebar from '../components/Sidebar/AdminSidebar'
import SearchInput from '../components/SearchInput'
import TableDepartments from '../components/PageDepartments/TableDepartments'
import { MainDiv } from '../components/Sidebar/styles/AdminSidebar.styled'
import Return from '../components/Return'
import Loading from '../components/Loading'

export default function PageDepartments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [showLoading, setShowLoading] = useState(true)

  const getDepartments = async () => {
    try {
      setShowLoading(true)
      const response = await fetch('/api/departments')
      const jsonData = await response.json()

      console.log(jsonData)
      setDepartments(jsonData)
    } catch (err) {
      console.error(err.message)
    } finally {
      setShowLoading(false)
    }
  }

  const checkAdmin = async() => {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { jwt_token: localStorage.token },
      })

      const parseRes = await res.json()
      console.log(parseRes)

      if (parseRes.role !== 'Admin') {
        navigate(`/profile/${parseRes.id}`)
      }
            
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    checkAdmin()
    getDepartments()
  }, [])

  return (
    <>
      <AdminSidebar isSelectedDepartment={true} />
      <MainDiv>
        <Return />
        <SearchInput
          placeholder="Search Departments"
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddDepartment />
        {showLoading ? (
          <Loading />
        ) : (
          <TableDepartments
            data={departments.filter((dpt) => {
              for (const property in dpt) {
                if (
                  String(dpt[property])
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return dpt
                }
              }
            })}
          />
        )}
      </MainDiv>
    </>
  )
}
