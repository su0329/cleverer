import React from "react";
import { localStorageHelper } from "../../../utility/localStorage";
import { UserRating } from "../../Rating";
import "./index.css";

/** SortByOption defines the supported sorting options for User rating list */
type SortByOption = 'starRating asc' | 'starRating desc' | 'id acs' | 'id desc'

/** UserRatingList is simply List UI to display all  user ratings record in local storage. Supporting pagination and sorting. */
export function UserRatingList(){
    const [pageIndex, setPageIndex] = React.useState(1);
    const [pageIndexInput, setPageIndexInput] = React.useState(pageIndex);
    const [pagination, setPagination] = React.useState<number>(10);
    const [sortby, setSortBy] = React.useState<SortByOption>('id acs'); // TODO: implement sorting 
    
    // sort and paginate data based on List config
    const paginatedData = React.useMemo(() => {
        let {data} = localStorageHelper.GetUserRating();

        if (!!!data || data?.length === 0) {
            return [];
        }
        

        // sort data
        data = (data as UserRating[]).sort((a: UserRating, b: UserRating) => {
            switch (sortby) {
                case 'starRating asc':
                    return a.starRating - b.starRating;
                case 'starRating desc':
                    return 0 - (a.starRating - b.starRating);
                case 'id desc':
                    return 0 - (a.id ?? 0) - (b.id ?? 0)
                case 'id acs':
                default:
                    return (a.id ?? 0) - (b.id ?? 0)
            }
        });

        let paginatedData: UserRating[][] = [];
        for(let i=0; i< data.length; i += pagination){
            paginatedData.push(data.slice(i, i + pagination));
        }

        return paginatedData;
    }, [pagination, sortby]);

    // jump to a specified page
    const goToPage = React.useCallback(() => {
        // page index should no less than 1
        if (pageIndexInput <= 1){
            setPageIndex(1);
            setPageIndexInput(1);
            return;
        }

        // page index should no more than total data slices
        if (pageIndexInput > paginatedData.length){
            setPageIndex(paginatedData.length);
            setPageIndexInput(paginatedData.length);
            return;
        }

        setPageIndex(pageIndexInput);
        setPageIndexInput(pageIndexInput);
    }, [pageIndexInput, paginatedData]);

    // go to next page
    const incrementPageIndex = React.useCallback(() => {
        if (pageIndex === paginatedData.length){
            return;
        }

        setPageIndex(index => ++index);
        setPageIndexInput(index => ++index)
    }, [pageIndex, pageIndexInput, paginatedData]);

    // go to previous page
    const decrementPageIndex = React.useCallback(() => {
        if (pageIndex === 1){
            return;
        }

        setPageIndex(index => --index);
        setPageIndexInput(index => --index);
    }, [pageIndex, pageIndexInput, paginatedData]);

    // early stop, list empty component
    if (!!!paginatedData || paginatedData.length === 0) {
        return <div>No data to display</div>
    }

    // table headers
    const headers = ['ID', 'Rating', 'Purpose of Visiting', 'Improvement'];

    // render table header row cells
    const TableHeaderRow = () => {
        return headers.map(
            (header, i) => {
                switch(header){
                    case 'ID':
                        return <th key={`header ${i}`}>
                            <select value={sortby} onChange={(event) => setSortBy(event.target.value as SortByOption)}>
                                <option value="id acs">ID acs</option>
                                <option value="id desc">ID desc</option>
                            </select>
                        </th>
                    case 'Rating':
                        return <th key={`header ${i}`}>
                        <select value={sortby} onChange={(event) => setSortBy(event.target.value as SortByOption)}>
                            <option value="starRating asc">Rating acs</option>
                            <option value="starRating desc">Rating desc</option>
                        </select>
                    </th>
                    default:
                        return <th key={`header ${i}`}>{header}</th>
                }
            }
    )};

    // render table body data rows
    const TableBodyRows = () => {
        return paginatedData[pageIndex-1].map((value, i) => (
            <tr key={`user rating ${i}`}>
                <td>{value.id}</td>
                <td>{value.starRating}</td>
                <td>{value.purpose}</td>
                <td>{value.improvement}</td>
            </tr>)
        )
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <TableHeaderRow />
                    </tr>
                </thead>
                <tbody>
                    <TableBodyRows />
                </tbody>
            </table>
            <div className="table-tool-container">
                <div className="table-tool">
                    <label htmlFor="pagination-select">Rows per page: </label>
                    <select id="pagination-select" value={pagination} onChange={(event)=>setPagination(Number(event.target.value))}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                
                <div className="table-tool">
                    <label htmlFor="pageIndex-input">Jump to: </label>
                    <input type="number" id="pageIndex-input" value={pageIndexInput} onChange={(event)=>setPageIndexInput(Number(event.target.value))}/>
                    <button onClick={goToPage}>go</button>
                </div>   

                <div className="table-tool">
                    <button onClick={decrementPageIndex}>{`<`}</button>
                    
                    <button onClick={incrementPageIndex}>{`>`}</button>
                </div>
            </div>
        </div>
    )
}