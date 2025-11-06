
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { Link } from 'react-router-dom'
import SkIconBtn from './SkIconBth'

export default function FavoritesButton() {
  return (
    <div className="ml-1.5 flex items-center text-center">
      <Link to="/ecosystem?tab=4">
        <SkIconBtn icon={FavoriteRoundedIcon} size="small" tooltipTitle="Your Favorites" />
      </Link>
    </div>
  )
}
