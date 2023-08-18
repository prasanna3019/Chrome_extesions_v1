import React, { useState, useEffect } from 'react';
import refresh from './assets/images/refresh.png';

const ListObjectSchema = ({ setQuery, files, token, setResult }) => {
    const [objs, setObjs] = useState([]);
    const [search, setSearch] = useState("");
    const [objsFiltered, setObjsFiltered] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        dataCatalogue();
    }, []);

    useEffect(() => {
        setObjsFiltered(
            objs.filter((obj) => {
                return obj.name.toLowerCase().includes(search.toLowerCase());
            })
        );
    }, [search, objs]);

    const handleClick = () => {
        setSearch("");
        setObjs([]);
        dataCatalogue();
    };

    const dataCatalogue = () => {
        let url = `${files.iu}/${files.ti}/IONSERVICES/datacatalog/v1/object/list?type=JSON`;
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.json())
        .then(json => {
            const obj = json.objects.filter((obj) => obj.subType === "JSONStream");
            setObjs(obj);
        })
        .catch(err => console.log(err));
    };

    const compassQuery = (name) => {
        if (!buttonDisabled) {
            setButtonDisabled(true);
            setQuery("Select ");
            setResult([]);
            let url = `${files.iu}/${files.ti}/IONSERVICES/datacatalog/v1/object/${name}`;
            fetch(url, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(res => res.json())
            .then(json => {
                const keys = Object.keys(json.schema.properties);
                const query = keys.map(key => `"${name}"."${key}"`).join(', ');
                setQuery(`Select ${query} From "${name}"`);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setButtonDisabled(false);
            });
        }
    };

    return (
        <div>
            <img src={refresh} height="20px" width="20px" alt="refresh" style={{ float: "right", paddingRight: "20px", margin: "10px", cursor: "pointer" }} onClick={handleClick} />
            {objs.length > 0 &&
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginLeft: "5px", marginRight: "10px" }} />}
            <div style={{ height: "500px", width: "200px", overflow: "hidden", overflowY: "scroll" }}>
                {objsFiltered && objsFiltered.map((obj) => (
                    <div
                        key={obj.name}
                        style={{
                            backgroundColor: "#36B0D7",
                            color: "white",
                            padding: "10px",
                            margin: "5px",
                            cursor: buttonDisabled ? "not-allowed" : "pointer",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            opacity: buttonDisabled ? 0.6 : 1
                        }}
                        onClick={() => compassQuery(obj.name)}
                    >
                        {obj.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListObjectSchema;
