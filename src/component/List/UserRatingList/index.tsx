import React from "react";
import { localStorageHelper } from "../../../Utility/localStorage";
import { UserRating } from "../../Rating";
import "./index.css";



export function UserRatingList(){
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pagination, setPagination] = React.useState<10 | 20 | 50>(10);
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

    if (!!!paginatedData || paginatedData.length === 0) {
        return <div>No data to display</div>
    }

    const headers = ['ID', 'Rating', 'Purpose of Visiting', 'Improvement'];


    return (
        <div>
            <table>
                <thead>
                    {headers.map((header, i) => <th key={`header ${i}`}>{header}</th>)}
                </thead>
                <tbody>
                    {
                    paginatedData[pageIndex].map((value, i) => (
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
                    <select id="pagination-select">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>
                
                <div className="table-tool">
                    <label htmlFor="pageIndex-input">Jump to: </label>
                    <input id="pageIndex-input" defaultValue={pageIndex} />
                    <button>go</button>
                </div>   

                <div className="table-tool">
                    <button>{`<`}</button>
                    <br />
                    <button>{`>`}</button>
                </div>
            </div>
        </div>
    )
}