import { useLoaderData } from "@remix-run/react";
import moment  from "moment";
import { Chart } from "react-google-charts";
import axios from "axios";


export async function loader() {
  const _ = require('lodash');
  const sites = [{id: "10338000"}, {id: "10338700" }, {id: "10346000"},
  {id: "10347460"}, {id: "10348000"}, {id: "10350000"}, {id: "10350340"}, {id: "10351600"}, {id: "10351650"}, {id: "10351700"}];
  
  const getData = async (site: { id: any; }) => {
      const stageUrl = `https://waterwatch.usgs.gov/webservices/realtime?site=${site.id}&format=json`;
      const floodUrl = `https://waterwatch.usgs.gov/webservices/floodstage?site=${site.id}&format=json`;
      const url = await fetch(stageUrl);
      const flood = await fetch(floodUrl);
      const urlData = await url.json();
      const floodData = await flood.json();
      const allData = _.merge(urlData, floodData);
      return allData
  }
  const monitors = [{id: "340", name: "Big Meadow", loc: "NV"}, {id: "834", name: "Truckee #2", loc: "CA"}, {id: "540", name: "Independence Creek", loc: "CA"}, {id: "652", name: "Mt Rose Ski Area", loc: "NV"},
  {id: "1242", name: "Little Valley", loc: "NV"}, {id: "784", name: "Palisades Tahoe", loc: "CA"}, {id: "809", name: "Tahoe City Cross", loc: "CA"},{id: "428", name: "Css Lab", loc: "CA"},
  {id: "541", name: "Independence Lake", loc: "CA"}, {id: "848", name: "Ward Creek #3", loc: "CA"}];
  const floodInformation = async (monitor: { loc: any; id: any; name: string }) => {
    var convert = require('xml-js');
    let xmls=`
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://www.wcc.nrcs.usda.gov/ns/awdbWebService" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <SOAP-ENV:Body>
        <q0:getInstantaneousData>
          <stationTriplets>${monitor.id}:${monitor.loc}:SNTL</stationTriplets>
          <elementCd>SNWD</elementCd>
          <ordinal>1</ordinal>
          <beginDate>${moment().format("YYYY-MM-DD")}</beginDate>
          <endDate>${moment().format("YYYY-MM-DD")}</endDate>
          <filter>ALL</filter>
          <unitSystem>ENGLISH</unitSystem>
        </q0:getInstantaneousData>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

return axios.post('https://wcc.sc.egov.usda.gov/awdbWebService/services?WSDL',
           xmls,
           {headers:
             {'Content-Type': 'text/xml'}
           }).then(res=>{
            const xmlChange = convert.xml2js(res.data)
            const snoDepth = xmlChange.elements[0].elements[0].elements[0].elements[0].elements[4].elements[2].elements[0].text
            const listSnoDepth = {text: snoDepth, id: monitor.id, name: monitor.name};
            return listSnoDepth
           }).catch(err=>{console.log(err)});
  }
  const nevada = await Promise.all(monitors.map(monitor => floodInformation(monitor)));
  const result = await Promise.all(sites.map(site => getData(site)));
  const resultSort = result.sort((a, b) => (a.sites[0].stage < b.sites[0].stage) ? 1 : -1)
return {resultSort, nevada};
};

export default function Index() {
  const lakeData = useLoaderData<typeof loader>();
  return (

    <main className="pt-5 pb-5 pr-4 min-h-screen bg-slate-500 text-center md:grid md:grid-cols-4 flex justify-center ">
      
        <div className="flex flex-column gap-y-4 gap-x-2 justify-center col-span-3 flex-wrap w-full">
          {lakeData.resultSort.map(data => (
            <div key={data.sites[0].site_no} className="base-1/2 pt-3 w-full justify-center items-center text-center rounded-lg shadow-lg bg-white max-w-sm">
              {data.sites[0].flow == "Ice" &&
              <div className="flex items-center justify-center bg-orange-500 text-white text-sm font-bold px-4 py-3" role="alert">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
              <p>Ice Reported at Gauge</p>
              </div>}
              <a href={data.sites[0].url}>
                <div>
                  <h5 className="p-2">{data.sites[0].station_nm}</h5>
                  <p>Flood Action Stage: {data.sites[0].action_stage} ft</p>
                  <p>Minor Flood Stage: {data.sites[0].flood_stage} ft</p>
                  { !data.sites[0].moderate_flood_stage ? "" : <p>Moderate Flood Stage: {data.sites[0].moderate_flood_stage} ft</p>}
                  { !data.sites[0].major_flood_stage ? "" : <p>Major Flood Stage: {data.sites[0].major_flood_stage} ft</p>}
                </div>
                <Chart
                  className="flex justify-center"
                  height={200}
                  chartType="Gauge"
                  loader={<div>Loading...</div>}
                  data={[
                    ["Label", "Value ft"],
                    [Math.round(data.sites[0].stage / data.sites[0].action_stage * 100) + " %", Number(data.sites[0].stage)]
                  ]}
                  options={{
                    greenFrom: data.sites[0].major_flood_stage ? data.sites[0].flood_stage : data.sites[0].action_stage,
                    greenTo: data.sites[0].major_flood_stage ? data.sites[0].moderate_flood_stage : data.sites[0].flood_stage,
                    yellowFrom: data.sites[0].major_flood_stage ? data.sites[0].moderate_flood_stage : null,
                    yellowTo: data.sites[0].major_flood_stage ? data.sites[0].major_flood_stage : null,
                    redFrom: data.sites[0].major_flood_stage ? data.sites[0].major_flood_stage : data.sites[0].flood_stage,
                    redTo: data.sites[0].major_flood_stage ? data.sites[0].major_flood_stage * 1.5 : data.sites[0].flood_stage * 1.5,
                    minorTicks: 5,
                    min: 0,
                    max: data.sites[0].major_flood_stage ? data.sites[0].major_flood_stage * 1.5 : data.sites[0].flood_stage * 1.5
                  }} />
                <div className="grid grid-rows-3 p-3">
                  <span className="text-sm font-bold">Flow: {data.sites[0].flow} {data.sites[0].flow_unit}. Average Flow: {data.sites[0].percent_mean} cfs</span>
                  <span className="text-sm font-bold">{Math.round(data.sites[0].stage / data.sites[0].action_stage * 100)} % full to Action Stage.</span>
                  <span className="text-sm font-bold"> Current height is {data.sites[0].stage} feet at the river gauge.</span>
                  <span className="text-xs">Date Retrieved: {moment(data.sites[0].stage_dt).format('MMM, DD YYYY @ HH:mm')}</span>
                </div></a>
            </div>
          ))}
        </div>
        <div className="space-y-5 max-w-full">
        
        <div className="bg-white rounded-lg p-6 shadow-md">
        
  <h3 className="text-lg font-medium mb-2">Truckee Basin Map</h3>
  <img src="https://cdn.imgbin.com/12/15/24/imgbin-truckee-river-map-great-basin-truckee-meadows-map-xSQpZGCPXHkd1f4a4xBPjg8Fg.jpg" alt={"Truckee Water Basin Map"}/>
</div>
<div className="bg-white rounded-lg p-6 shadow-md">
  <h3 className="text-lg font-medium mb-2">Truckee Basin Snow Pack Information</h3>
  {lakeData.nevada.map((sno) => (
    <p key={sno.id}>{sno.name}: {sno.text} inches</p>
  ))}
</div>
<div className="bg-white rounded-lg p-6 shadow-md">
  <h3 className="text-lg font-medium mb-2">NOAA Weather Brief</h3>
  <a href="https://www.weather.gov/images/rev/WxStory/WeatherStory1.png?c3cba607fc51cfff852684ebb15328cc"><img src="https://www.weather.gov/images/rev/WxStory/WeatherStory1.png?c3cba607fc51cfff852684ebb15328cc" alt="Wether Story"></img></a>

</div>
<div className="bg-white rounded-lg p-6 shadow-md">
  <h3 className="text-lg font-medium mb-2">Links</h3>
  <p className="text-gray-600 mb-4"><a href="https://www.nrcs.usda.gov/Internet/WCIS/AWS_PLOTS/basinCharts/POR/WTEQ/assocHUCnv_8/truckee.html">SNOTEL Truckee Basin Graph</a></p>
  <p className="text-gray-600 mb-4"><a href="https://www.cwsd.org/flood-risk-mitigation-projects/">Flood Hazard Reduction Plans and Documents</a></p>
</div>
</div>
</main>
  );
}
