import { useState, useEffect } from "react";




function sortRule (list, key, column) {
    list?.[key].sort((a,b) => {
        const colA = a[column];
        const colB = b[column];
        if (typeof(colA) === "boolean" && typeof(colB) === "boolean") { 
            return Number(colB) - Number(colA)
        }
        if (typeof(colA) === "string" && typeof(colB) === "string") { 
            return colA.localeCompare(colB) 
        }
        else if (colA > colB) {
            return 1
        }
        else if (colA < colB) {
            return -1
        }
        else {return 0}
    });
    
    return list;
    
}



function TableGroups({
    groupList, editGroupId, handleEditGroupRow, handleDeleteId, editedGroup, setEditGroupID, setEditedGroup, profList
}) {

    const [sortColumn, setSortColumn] = useState();
    const [edit, setEdit] = useState(null);


    useEffect(() => {
        sortRule(groupList, "groups", sortColumn);
    }, [sortColumn])

    const onHeaderClick = (column) => ({
        onClick: () => {
            console.log(`clicked on ${column}`)
            sortRule(groupList, "groups", column)
            setSortColumn(column)
            },
        });    


    


    return(
        <table className="adminTable">
            <thead>
                <tr>
                    <th scope="col"> # </th>
                    <th scope="col" {...onHeaderClick("group_id")}>group id {sortColumn == "group_id" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("professor_id")}>professor {sortColumn == "professor_id" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("name")}>name {sortColumn == "name" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("academic_year")}>academic year {sortColumn == "academic_year" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("created_at")}>created at {sortColumn == "created_at" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("school")}> school {sortColumn == "created_at" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("is_active")}>is active {sortColumn == "is_active" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("nbr_students")}> # students {sortColumn == "nbr_students" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col"> </th>
                </tr>
            </thead>
            <tbody>
                {groupList.groups.at(0) == null ? (
                    <tr>
                        <td colSpan={7}>
                            No group available
                        </td>
                    </tr>
                ) : ( 
                groupList.groups.map((group, i) => (
                        <tr key={group.group_id} style={{backgroundColor: group.is_active ? "#a4f9a1" : "#f9a1a1"}}>
                            <td>{i}</td>
                            <td>{group.group_id}</td>
                            <td>{editGroupId == group.group_id ? <select value={editedGroup[group.group_id]?.professor_id ?? group.professor_id_id} onChange={
                                (e) => setEditedGroup( old => ({
                                    ...old, [group.group_id]:{ ...old[group.group_id], professor_id: e.target.value}
                                }))}> 
                                    <option value=""> -- Select a professor -- </option>
                                    { (profList && profList.users.length > 0 ? (profList.users.map(
                                        e => <option key={e.id} value={String(e.id)}> {e.lastName}</option>
                                    )): (<option value="noprof"> There is no professor available</option>)) 
                                    }
                                </select>
                                : profList?.users?.find(u => u?.id === group?.professor_id)?.firstName}
                            </td>
                            <td> {editGroupId === group.group_id ? <input value={editedGroup[group.group_id]?.name ?? group.name} onChange={
                                (e) => setEditedGroup( old => ({ ...old, [group.group_id]:{...old[group.group_id], name: e.target.value} }))}
                            /> : group.name}
                            </td>
                            <td>{ editGroupId === group.group_id ? <input value={editedGroup[group.group_id]?.academic_year ?? group.academic_year} onChange={
                                (e) => setEditedGroup( old => ({...old, [group.group_id]:{...old[group.group_id], academic_year: e.target.value}}))}
                                /> : group.academic_year}
                            </td>
                            <td>{group.created_at}</td>
                            <td>{ editGroupId === group.group_id ? <input value={editedGroup[group.group_id]?.school ?? group.school} onChange={
                                (e) => setEditedGroup( old => ({...old, [group.group_id]:{...old[group.group_id], school: e.target.value}}))}
                                /> : group.school}
                            </td>
                            <td>{ editGroupId === group.group_id ? <select value={editedGroup[group.group_id]?.is_active ?? group.is_active} onChange={
                                (e) => setEditedGroup(old => ({...old, [group.group_id]:{...old[group.group_id], is_active: e.target.value}}))}>
                                    <option value=""> -- </option>
                                    <option key={group.group_id+1} value={"activate"}> activate </option>
                                    <option key={group.group_id+2} value={"deactivate"}> deactivate</option>
                            </select>
                            : group.is_active ? "active" : "inactive"}</td>
                            
                            <td>{Number(group.student?.length)}</td>
                            <td className="action">
                                    <div className="action_cell">
                                        <div className={`actionIcons ${edit === group.group_id ? "open" : ""}`}>
                                            <a key={group.group_id+1} className="action_btn" onClick={() => handleEditGroupRow(group.group_id)}> <Pencil size={25} strokeWidth={1.5}/> </a>
                                            <a key={group.group_id+2} className="action_btn" onClick={(e) => {
                                                const confirmBox = window.confirm("Do you really want to delete the group?") 
                                                if (confirmBox === true ){
                                                    handleDeleteId(e, "groups", group.group_id)
                                                } else {console.log("Abort delete")}}}> <Trash size={25} strokeWidth={1.5} /> </a>
                                        </div>
                                        <span key={group.group_id+3} className="ellipsis" onClick={() => setEdit(prev => (prev === group.group_id ? null : group.group_id))}> <EllipsisVertical size={25} strokeWidth={1.5} /> </span>
                                    </div>
                                </td>
                        </tr>
                    )
                ))}
            </tbody>
        </table>
    );
}