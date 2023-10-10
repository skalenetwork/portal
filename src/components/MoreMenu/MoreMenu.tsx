import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import { Link } from "react-router-dom";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

import { cls, styles, cmn } from "@skalenetwork/metaport";

export default function MoreMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip arrow title="Useful links">
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className={cls(styles.paperGrey, cmn.pPrim, cmn.mleft10)}
          >
            <MoreVertIcon
              className={cls(cmn.pPrim)}
              style={{ height: "20px", width: "20px" }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        className="mp__moreMenu"
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link to="/other/terms-of-service" className="undec fullWidth">
          <MenuItem onClick={handleClose}>
            <InventoryOutlinedIcon className={cmn.mri10} /> Terms of service
          </MenuItem>
        </Link>
        <a
          className="undec fullWidth"
          target="_blank"
          href="https://skale.space/" rel="noreferrer"
        >
          <MenuItem onClick={handleClose}>
            <div className={cmn.flex}>
              <PublicOutlinedIcon className={cmn.mri10} />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}>Main website</div>
            <div className={cls(cmn.flex, cmn.mleft10)}>
              <ArrowOutwardIcon className="menuIconRi" />
            </div>
          </MenuItem>
        </a>
        <a
          className="undec fullWidth"
          target="_blank"
          href="https://docs.skale.network/" rel="noreferrer"
        >
          <MenuItem onClick={handleClose} className="undec">
            <div className={cmn.flex}>
              <ArticleOutlinedIcon className={cmn.mri10} />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}>Docs portal</div>
            <div className={cls(cmn.flex, cmn.mleft10)}>
              <ArrowOutwardIcon className="menuIconRi" />
            </div>
          </MenuItem>
        </a>
        {/* <MenuItem onClick={handleClose} className='undec fullWidth'>
                    <div className={cmn.flex}>
                        <HubOutlinedIcon className={cmn.mri10} />
                    </div>
                    <div className={cls(cmn.flex, cmn.flexg)}>
                        Endpoints
                    </div>
                    <div className={cls(cmn.flex, cmn.mleft10)}>
                        <ArrowOutwardIcon className="menuIconRi" />
                    </div>
                </MenuItem> */}
      </Menu>
    </React.Fragment>
  );
}
