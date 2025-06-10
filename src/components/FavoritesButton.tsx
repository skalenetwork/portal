import { Box } from '@mui/material'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { useNavigate } from 'react-router-dom'
import { cmn } from '@skalenetwork/metaport'
import SkIconBtn from './SkIconBth'

export default function FavoritesButton() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/ecosystem?tab=3')
  }

  return (
    <Box
      className={cmn.mleft5}
      sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
    >
      <SkIconBtn
        icon={FavoriteRoundedIcon}
        onClick={handleClick}
        size="small"
        tooltipTitle="Your Favorites"
      />
    </Box>
  )
}
