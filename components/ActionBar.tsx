import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded"
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded"
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded"
import TuneRoundedIcon from "@mui/icons-material/TuneRounded"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useState } from "react"

import { KEEP_STRATEGY_LABELS, type KeepStrategy } from "../lib/keep-strategy"
import { photoSweepColors } from "../lib/theme"

export type ReviewFilter = "all" | "exact" | "similar"

interface ActionBarProps {
  totalItems: number
  groupCount: number
  totalGroupCount: number
  exactGroupCount: number
  similarGroupCount: number
  duplicateCount: number
  reviewFilter: ReviewFilter
  onReviewFilterChange: (filter: ReviewFilter) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onTrash: () => void
  onRescan: () => void
  onExportJson: () => void
  onExportCsv: () => void
  onApplyKeepStrategy: (strategy: KeepStrategy) => void
  compact?: boolean
}

export function ActionBar({
  totalItems,
  groupCount,
  totalGroupCount,
  exactGroupCount,
  similarGroupCount,
  duplicateCount,
  reviewFilter,
  onReviewFilterChange,
  onSelectAll,
  onDeselectAll,
  onTrash,
  onRescan,
  onExportJson,
  onExportCsv,
  onApplyKeepStrategy,
  compact = false
}: ActionBarProps) {
  const [keepMenuAnchor, setKeepMenuAnchor] = useState<HTMLElement | null>(null)
  const keepMenuOpen = Boolean(keepMenuAnchor)

  return (
    <Paper
      elevation={0}
      sx={{
        position: compact ? "static" : "sticky",
        top: compact ? undefined : 80,
        zIndex: 9,
        px: compact ? 1 : { xs: 1.5, md: 2 },
        py: compact ? 1 : 1.25,
        mb: compact ? 1 : 2,
        borderRadius: compact ? 2.25 : 3,
        border: "1px solid",
        borderColor: compact
          ? photoSweepColors.border
          : "rgba(214,226,221,0.86)",
        bgcolor: compact
          ? photoSweepColors.surface
          : photoSweepColors.surfaceTint,
        backdropFilter: compact ? "none" : "saturate(180%) blur(24px)",
        boxShadow: compact
          ? "none"
          : `0 18px 52px ${photoSweepColors.shadow}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: compact ? 1 : 1.5
      }}>
      <Box
        sx={{
          minWidth: compact ? "100%" : { xs: "100%", sm: 240 },
          display: compact ? "grid" : "block",
          gridTemplateColumns: compact ? "36px minmax(0, 1fr)" : undefined,
          gap: compact ? 1 : undefined,
          alignItems: compact ? "center" : undefined
        }}>
        {compact && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: photoSweepColors.primarySoft,
              color: photoSweepColors.primary
            }}>
            <ArticleOutlinedIcon sx={{ fontSize: 19 }} />
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            fontWeight={800}
            sx={{ lineHeight: 1.2 }}>
            {groupCount.toLocaleString()} duplicate set
            {groupCount !== 1 ? "s" : ""} to review
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.2, lineHeight: 1.25 }}>
            {totalItems.toLocaleString()} photos and videos checked
            {groupCount !== totalGroupCount ? " · " : ""}
            {groupCount !== totalGroupCount && (
              <Box component="span">
                {totalGroupCount.toLocaleString()} sets total
              </Box>
            )}
          </Typography>
        </Box>
      </Box>

      {totalGroupCount > 0 && compact && (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gap: 0.8
          }}>
          <ToggleButtonGroup
            value={reviewFilter}
            exclusive
            size="small"
            fullWidth
            aria-label="Review filter"
            sx={{
              bgcolor: photoSweepColors.surfaceSoft,
              borderRadius: 1.75,
              p: 0.25,
              "& .MuiToggleButton-root": {
                borderColor: "transparent",
                minHeight: 38,
                px: 1,
                fontSize: 12.5,
                fontWeight: 700
              }
            }}
            onChange={(_, value) => {
              if (value !== null) onReviewFilterChange(value)
            }}>
            <ToggleButton value="all">
              All ({totalGroupCount.toLocaleString()})
            </ToggleButton>
            <ToggleButton value="exact">
              Exact ({exactGroupCount.toLocaleString()})
            </ToggleButton>
            <ToggleButton value="similar">
              Similar ({similarGroupCount.toLocaleString()})
            </ToggleButton>
          </ToggleButtonGroup>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              gap: 0.5,
              "& .MuiIconButton-root": {
                width: "100%",
                height: 36,
                border: "1px solid",
                borderColor: photoSweepColors.border,
                borderRadius: 1.5,
                color: "primary.main",
                bgcolor: photoSweepColors.surface
              },
              "& .MuiIconButton-root.Mui-disabled": {
                bgcolor: photoSweepColors.surfaceSoft
              }
            }}>
            <Tooltip title="Scan again">
              <IconButton
                aria-label="Scan again"
                size="small"
                onClick={onRescan}>
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export report">
              <IconButton
                aria-label="Export report"
                size="small"
                onClick={onExportJson}>
                <ArticleOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Spreadsheet">
              <IconButton
                aria-label="Spreadsheet"
                size="small"
                onClick={onExportCsv}>
                <TableChartRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Auto Keep">
              <span>
                <IconButton
                  aria-label="Auto Keep"
                  size="small"
                  onClick={(event) => setKeepMenuAnchor(event.currentTarget)}
                  disabled={groupCount === 0}
                  aria-controls={
                    keepMenuOpen ? "keep-strategy-menu" : undefined
                  }
                  aria-haspopup="menu"
                  aria-expanded={keepMenuOpen ? "true" : undefined}>
                  <TuneRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Include all">
              <span>
                <IconButton
                  aria-label="Include all"
                  size="small"
                  disabled={groupCount === 0}
                  onClick={onSelectAll}>
                  <CheckBoxOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Skip all">
              <span>
                <IconButton
                  aria-label="Skip all"
                  size="small"
                  disabled={groupCount === 0}
                  onClick={onDeselectAll}>
                  <CheckBoxOutlineBlankIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Menu
            id="keep-strategy-menu"
            anchorEl={keepMenuAnchor}
            open={keepMenuOpen}
            onClose={() => setKeepMenuAnchor(null)}>
            {(Object.keys(KEEP_STRATEGY_LABELS) as KeepStrategy[]).map(
              (strategy) => (
                <MenuItem
                  key={strategy}
                  onClick={() => {
                    onApplyKeepStrategy(strategy)
                    setKeepMenuAnchor(null)
                  }}>
                  {KEEP_STRATEGY_LABELS[strategy]}
                </MenuItem>
              )
            )}
          </Menu>

          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteOutlineRoundedIcon />}
            disabled={duplicateCount === 0}
            onClick={onTrash}
            sx={{
              width: "100%",
              minHeight: 40,
              borderRadius: 1.5,
              fontWeight: 800,
              bgcolor: photoSweepColors.error,
              "&:hover": {
                bgcolor: photoSweepColors.errorDark
              }
            }}>
            Move {duplicateCount} to Trash
          </Button>
        </Box>
      )}

      {totalGroupCount > 0 && !compact && (
        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ width: compact ? "100%" : "auto" }}>
          <ToggleButtonGroup
            value={reviewFilter}
            exclusive
            size="small"
            fullWidth={compact}
            aria-label="Review filter"
            sx={{
              bgcolor: photoSweepColors.surfaceSoft,
              borderRadius: 2,
              p: 0.25,
              "& .MuiToggleButton-root": {
                borderColor: "transparent",
                px: compact ? 1 : 1.25
              }
            }}
            onChange={(_, value) => {
              if (value !== null) onReviewFilterChange(value)
            }}>
            <ToggleButton value="all">
              All{compact ? "" : ` sets (${totalGroupCount.toLocaleString()})`}
            </ToggleButton>
            <ToggleButton value="exact">
              {compact
                ? "Exact"
                : `Identical (${exactGroupCount.toLocaleString()})`}
            </ToggleButton>
            <ToggleButton value="similar">
              Similar{compact ? "" : ` (${similarGroupCount.toLocaleString()})`}
            </ToggleButton>
          </ToggleButtonGroup>
          {!compact && (
            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          )}
          <Button
            size="small"
            startIcon={<RefreshRoundedIcon />}
            onClick={onRescan}>
            Scan again
          </Button>
          <Button
            size="small"
            startIcon={<DownloadRoundedIcon />}
            onClick={onExportJson}>
            Export report
          </Button>
          <Button
            size="small"
            startIcon={<DownloadRoundedIcon />}
            onClick={onExportCsv}>
            Spreadsheet
          </Button>
          {!compact && (
            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          )}
          <Button
            size="small"
            startIcon={<TuneRoundedIcon />}
            onClick={(event) => setKeepMenuAnchor(event.currentTarget)}
            disabled={groupCount === 0}
            aria-controls={keepMenuOpen ? "keep-strategy-menu" : undefined}
            aria-haspopup="menu"
            aria-expanded={keepMenuOpen ? "true" : undefined}>
            Auto Keep
          </Button>
          <Menu
            id="keep-strategy-menu"
            anchorEl={keepMenuAnchor}
            open={keepMenuOpen}
            onClose={() => setKeepMenuAnchor(null)}>
            {(Object.keys(KEEP_STRATEGY_LABELS) as KeepStrategy[]).map(
              (strategy) => (
                <MenuItem
                  key={strategy}
                  onClick={() => {
                    onApplyKeepStrategy(strategy)
                    setKeepMenuAnchor(null)
                  }}>
                  {KEEP_STRATEGY_LABELS[strategy]}
                </MenuItem>
              )
            )}
          </Menu>
          {!compact && (
            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          )}
          <Button
            size="small"
            startIcon={<CheckBoxOutlinedIcon />}
            disabled={groupCount === 0}
            onClick={onSelectAll}>
            Include all
          </Button>
          <Button
            size="small"
            startIcon={<CheckBoxOutlineBlankIcon />}
            disabled={groupCount === 0}
            onClick={onDeselectAll}>
            Skip all
          </Button>
          {!compact && (
            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          )}
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteOutlineRoundedIcon />}
            disabled={duplicateCount === 0}
            onClick={onTrash}
            sx={compact ? { width: "100%" } : undefined}>
            {compact
              ? `Move ${duplicateCount} to Trash`
              : `Move ${duplicateCount} Duplicate${
                  duplicateCount !== 1 ? "s" : ""
                } to Trash`}
          </Button>
        </Stack>
      )}
    </Paper>
  )
}
