import React from "react";
import { localStorageHelper } from "../../../Utility/localStorage";
import { UserRating } from "../../Rating";
import "./index.css";

export function UserRatingList(){
    const [pageIndex, setPageIndex] = React.useState(1);
    const [pageIndexInput, setPageIndexInput] = React.useState(pageIndex);
    const [pagination, setPagination] = React.useState<number>(10);
    const [sortby, setSortBy] = React.useState<'starRating asc' | 'starRating desc' | 'id acs' | 'id desc'>('id acs')
    
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

    const goToPage = () => {
        if (pageIndexInput <= 1){
            setPageIndex(1);
            setPageIndexInput(1);
            return;
        }

        if (pageIndexInput > paginatedData.length){
            setPageIndex(paginatedData.length);
            setPageIndexInput(paginatedData.length);
            return;
        }

        setPageIndex(pageIndexInput);
        setPageIndexInput(pageIndexInput);
    };

    const incrementPageIndex = () => {
        if (pageIndex === paginatedData.length){
            return;
        }


        setPageIndex(index => ++index);
        setPageIndexInput(index => ++index)
    };

    const decrementPageIndex = () => {
        if (pageIndex === 1){
            return;
        }

        setPageIndex(index => --index);
        setPageIndexInput(index => --index);
    };

    if (!!!paginatedData || paginatedData.length === 0) {
        return <div>No data to display</div>
    }

    const headers = ['ID', 'Rating', 'Purpose of Visiting', 'Improvement'];

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {headers.map((header, i) => <th key={`header ${i}`}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {
                    paginatedData[pageIndex-1].map((value, i) => (
                        <tr key={`user rating ${i}`}>
                            <td>{value.id}</td>
                            <td>{value.starRating}</td>
                            <td>{value.purpose}</td>
                            <td>{value.improvement}</td>
                        </tr>))
                    }
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
                    <hr />
                    <button onClick={incrementPageIndex}>{`>`}</button>
                </div>
            </div>
        </div>
    )
}