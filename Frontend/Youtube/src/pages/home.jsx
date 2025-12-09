import { useGetAllVideos } from '../hooks/useApi';
import { useState } from 'react';
import {CircularProgress, Box, TextField, Grid} from '@mui/material';



function Home() {
  const [filters, setFilters] = useState({
    page: 1,
    limit:20,
    query:'',
    sortBy: 'createdAt',
    sortType: 'desc',
  })

  const {data, isLoading, error} = useGetAllVideos(filters)

  const handleSearch = (value) => {
    setFilters({
      ...filters, query:value, page:1
    })
  }
  if(isLoading) return <CircularProgress />
  if(error) return <div>Error loading videos</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Videos</h1>

      <TextField
        placeholder="Search videos..."
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-6 w-full"
      />

      <Grid container spacing={2}>
        {data?.data?.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
            <Link to={`/video/${video._id}`}></Link>
            <div className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg cursor-pointer">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-bold text-white truncate">{video.title}</h3>
                <p className="text-gray-400 text-sm">{video.owner?.username}</p>
                <p className="text-gray-500 text-xs">{video.views} views</p>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Home;
