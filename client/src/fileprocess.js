import React, { Component } from 'react';
import axios from 'axios';

class FileProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
          message : '',
          file : '',
          delimiter : ',',
          lines : 2,
          data : [],
          header : [],
          displayData : [],
          resultdelimiter : "true"
        }
      }

    handleFile = (e) => {
        // console.log(e.target.files)
        const formData = new FormData()
        formData.append("file", e.target.files[0]);
        axios.post(`http://localhost:5050/api/upload/`, formData)
            .then( resp => {
                if(resp.data.delimiter === "false"){
                    alert("Please change the delimiter found in file and click on Process button");
                    this.setState({resultdelimiter : "false"})
                }
                this.setState({
                    data : resp.data.data,
                    displayData : resp.data.data.slice(0,2),
                    lines : 2,
                    delimiter : ','
                })
            })
            .catch( err => {
                console.log(err)
            })
        this.setState({
            file:e.target.files[0].name,
            message : `${e.target.files[0].name} Uploaded Successfully`
        })
            
        // Reading file data without Node JS
        // const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        // if (regex.test(e.target.files[0].name.toLowerCase())) {
        //     this.setState({
        //         file:e.target.files,
        //         message : `${e.target.files[0].name} Uploaded Successfully`
        //         })
        //     let filereader = new FileReader();
        //     filereader.onload = (r) => { 
        //         // console.log(r.target.result)
        //         let rows = r.target.result.split("\n");
        //         let results = [];
        //         if(rows[0].toString().includes(',')){
        //         let headers = rows[0].split(',');
        //         for(let i=1;i<rows.length;i++){
        //         let obj = {};
        //         let currentline = rows[i].split(',');
        //         for(let j=0;j<headers.length;j++){
        //                 obj[headers[j]] = currentline[j];
        //             }
        //             results.push(obj);

        //             }
        //         // console.log(results);
        //         this.setState({
        //             data : results,
        //             header : headers,
        //             displayData : results.slice(0,2)
        //         })
        //         }else{
        //             alert("Please change the delimiter found in file and click on Process button");
        //         }
        //     }
        //     filereader.readAsText(e.target.files[0])
        // } else {
        //     alert("Please upload a valid CSV or txt file.");
        // }
    }

    handleChange = (e) => {
        // console.log(e.target.value,e.target.name);
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleProcess = (e) => {
        e.preventDefault()
        console.log(this.state.file,this.state.delimiter,this.state.data)
        let { delimiter, lines, data, resultdelimiter, file } = this.state;
        if(lines < 0) alert("Please enter whole numbers !!!");
        else if(lines > data.length) alert(`Entered number is greater than the data's length ${data.length}`)
            let params = {
                fname : file,
                delimiter : delimiter,
                lines : lines
            }
            axios.post(`http://localhost:5050/api/upload/delimiter`, params)
            .then( resp => {
                let nlines = resp.data.lines;
                this.setState({
                    data : resp.data.data,
                    displayData : resp.data.data.slice(0,nlines),
                    resultdelimiter : resp.data.delimiter
                })
            })
            .catch( err => {
                console.log(err)
            })

        // Reading file data without Node JS
        // let { delimiter, lines } = this.state;
        // if(lines < 0) alert("Please enter whole numbers !!!")
        // let filereader = new FileReader();
        // filereader.onload = (r) => { 
        // let rows = r.target.result.split("\n");
        // let results = [];
        // // console.log(rows[0].toString(),delimiter)
        // let headers = rows[0].split(`${delimiter}`);
        // for(let i=1;i<rows.length;i++){
        //         let obj = {};
        //         let currentline = rows[i].split(`${delimiter}`);
        //         for(let j=0;j<headers.length;j++){
        //             obj[headers[j]] = currentline[j];
        //         }
        //         results.push(obj);
        //     }
        //     if(lines > results.length) alert(`Entered number is greater than the data's length ${results.length}`)
        //     this.setState({
        //         data : results,
        //         header : headers,
        //         displayData : results.slice(0,lines)
        //     })
        // }
        // filereader.readAsText(this.state.file[0])
    }

    render() { 
        let { message, file, delimiter, lines, data, displayData, resultdelimiter } = this.state
        return ( 
            <form className="container"  onSubmit={this.handleProcess} >
                <div className="form-group text-center">
                    <h2>File Processing Task</h2>
                </div>
                <div className="form-group custom-file">
                    <input className="form-group custom-file-input" type="file" id="file" accept=".csv,.txt" name="file" required onChange={(e) => this.handleFile(e)}/><br/>
                    <label className="custom-file-label">Choose file</label>
                    <span className="text-primary mt-3 mb-3 font-weight-bold">
                        {message} 
                    </span>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6 mb-3">
                        <label>Delimiter</label>
                        <input type="text" className="form-control" name="delimiter" defaultValue="," value={delimiter} onChange={(e) => this.handleChange(e)} placeholder="Delimiter"  required />
                    </div>
                    <div className="col-sm-6 mb-3">
                        <label>Lines</label>
                        <input type="number" className="form-control" name="lines" defaultValue="2" value={lines} onChange={(e) => this.handleChange(e)} placeholder="Lines" required />
                    </div>
                </div>
                <div className="form-group text-center">
                    { file && delimiter && lines &&
                        <input type="submit" id="proc" className="btn btn-primary" value="Process"/>
                    }
                </div>
                <table className = "table table-bordered">
                    { data.length>0 &&
                    <tbody>
                            {
                        resultdelimiter === "true" ?
                        displayData.map((item,idx) => {
                        return <tr key = {idx}>
                            {
                                item.map((elem, index) => <td key={index}>{elem}</td>)
                            }
                            </tr>
                        })
                        :
                        displayData.map((item,idx) => {
                            return <tr key = {idx}>
                                   <td key={idx}>{item}</td>
                                </tr>
                            })
                    }
                    </tbody>
                }
                </table>

                {/* Processed data without node js */}
                {/* <table className="table">
                    {
                        data.length>0 && 
                        <thead>
                            <tr>
                            {
                                header.map((item, idx) => <th key={idx}>{item}</th>)
                            }
                            </tr>
                        </thead>
                    }
                    {
                        data.length>0 &&
                        <tbody>
                            {
                                displayData.map((item,idx) => {
                                        return <tr key={idx}>
                                                    {Object.keys(item).map(key => <td key={key}>{item[key]}</td>)}
                                                </tr>
                                    // return <tr key={idx}>
                                    //     {
                                    //         header.map(head => <td>{item[head]}</td>)
                                    //     }
                                    // </tr>
                                })
                            }
                        </tbody>
                    }
                </table> */}
            </form>
         );
    }
}
 
export default FileProcess;