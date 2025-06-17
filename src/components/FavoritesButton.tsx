import { Box } from '@mui/material'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { Link } from 'react-router-dom'
import { cmn } from '@skalenetwork/metaport'
import SkIconBtn from './SkIconBth'

export default function FavoritesButton() {
  return (
    <Box
      className={cmn.mleft5}
      sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
    >
      <Link to="/ecosystem?tab=4">
        <SkIconBtn
          icon={FavoriteRoundedIcon}
          size="small"
          tooltipTitle="Your Favorites"
        />
      </Link>
    </Box>
  )
}
