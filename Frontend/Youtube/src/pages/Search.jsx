import { useSearchParams } from "react-router-dom";
import { useGetAllVideos } from "../hooks/useApi";
import { CircularProgress,Grid } from "@mui/material";


function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const {data, isLoading, error} = useGetAllVideos({
    query,
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortType: 'desc',
  })

  if(isLoading) return <CircularProgress />
  if(error) return <div className="p-4">Error loading videos</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>

      <Grid container spacing={2}>
        {data?.data?.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
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

      {data?.data?.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No videos found</div>
      )}
    </div>
  )
}

export default Search;
