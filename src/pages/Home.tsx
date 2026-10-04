import { useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import FilterBar from '../components/FilterBar'

function Home() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')

  return (
    <>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />
      <ProductGrid
        search={search}
        category={category}
        sort={sort}
      />
    </>
  )
}

export default Home