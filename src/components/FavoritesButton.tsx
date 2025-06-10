import { Box, Button, Tooltip } from '@mui/material'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { Link } from 'react-router-dom'
import { cls, cmn, styles } from '@skalenetwork/metaport'

export default function FavoritesButton() {
  return (
    <Box
       sx={{ alignItems: 'center', textAlign: 'center', display: { xs: 'none', sm: 'flex' } }}
       className={cls(cmn.mleft5)}
    >
      <Tooltip arrow title="Your Favorites">
        <Button
          component={Link}
          to="/ecosystem?tab=3"
          startIcon={<FavoriteRoundedIcon />}
          className={cls('mp__btnConnect', styles.paperGrey, cmn.pPrim, cmn.flex,)}
        >
          Your Favorites
        </Button>
      </Tooltip>
    </Box>
  )
}
