import { useEffect, useState, useRef } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { ICountry } from "../utils/interfaces/country";
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
} from "../utils/constants";
import axios from "axios";
import { hideLoader, showLoader } from "../utils/helpers";
import { debounce } from "lodash";
import Config from "../config";

const Dashboard = () => {
  const [countryList, setCountryList] = useState<ICountry[]>();
  const [searchText, setSearchText] = useState<string>("");
  const [page, setPage] = useState<number>(DEFAULT_PAGE_NO);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const [orderBy, setOrderBy] = useState<string>("");
  const [order, setOrder] = useState<string>("asc");
  const searchRef = useRef<HTMLInputElement>(null);

  const getSearchedCountryList = async (searchedText: string) => {
    try {
      if (searchedText) {
        showLoader();
        const response = await axios.get(
          `${Config.env.BaseUrl}/name/${searchedText}`
        );
        setCountryList(response.data);
        hideLoader();
      } else {
        getCountryList();
      }
    } catch (e) {
      setCountryList([]);
      hideLoader();
    }
  };

  const getCountryList = async () => {
    try {
      showLoader();
      const response = await axios.get(`${Config.env.BaseUrl}/all`);
      setCountryList(response.data);
      hideLoader();
    } catch (e) {
      setCountryList([]);
      hideLoader();
    }
  };

  const handleKeyboardShortcut = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      searchRef?.current?.focus();
      event.preventDefault();
    }
  };

  useEffect(() => {
    getCountryList();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcut);

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [searchRef]);

  const debouncedFetchData = debounce(getSearchedCountryList, 1500);

  const handleCountrySearch = (event: any) => {
    setSearchText(event.target.value);
    debouncedFetchData(event.target.value);
  };

  const handleCountrySearchKeyDown = (e: any) => {
    if (
      (e?.key === "Enter" && e.target.value?.trim()) ||
      (e?.key === "Enter" && !e.target.value)
    ) {
      setPage(0);
      getSearchedCountryList(e.target.value);
    }
  };

  const handleSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const sortedData = countryList?.slice().sort((a, b) => {
    if (orderBy === "name") {
      return order === "asc"
        ? a.name.common.localeCompare(b.name.common)
        : b.name.common.localeCompare(a.name.common);
    } else if (orderBy === "flag") {
      return order === "asc"
        ? a.flag.localeCompare(b.flag)
        : b.flag.localeCompare(a.flag);
    }
    return 0;
  });
  const sortedDataList =
    sortedData && sortedData?.length > rowsPerPage
      ? sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedData;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Typography variant="h4" className="country-title">
        Countries
      </Typography>

      <Grid item xs={12}>
        <TextField
          id="search"
          variant="outlined"
          inputRef={searchRef}
          type="text"
          className="search-input"
          placeholder="Search country by name..."
          value={searchText}
          onChange={handleCountrySearch}
          onKeyDown={handleCountrySearchKeyDown}
        />
      </Grid>

      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="table-head">
              <TableRow className="table-header-row">
                <TableCell>No</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? "desc" : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Country Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "flag"}
                    direction={orderBy === "flag" ? "desc" : "asc"}
                    onClick={() => handleSort("flag")}
                  >
                    Country Flag
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDataList?.length ? (
                sortedDataList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1 + rowsPerPage * page}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.name.common}
                    </TableCell>
                    <TableCell align="center" className="country-flag">
                      {row?.flag}
                      <img
                        src={row.flags.png}
                        alt={row.flags.alt}
                        className="flag-img"
                      ></img>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography className="no-record-text">
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={PAGE_SIZES}
          component="div"
          count={countryList ? countryList?.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          hidden={!countryList?.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
