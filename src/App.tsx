import { url } from 'inspector';
import { useEffect, useState } from 'react';

interface TrackingDetail {
  kind: string;
  level: number;
  manName: string;
  manPic: string;
  telno: string;
  telno2: string;
  time: number;
  timeString: string;
  where: string;
  code: string | null;
  remark: string | null;
  //code - string or null / remark -string or null
}

interface PackageData {
  adUrl: string;
  complete: boolean;
  invoiceNo: string;
  itemImag: string;
  itemName: string;
  level: number;
  receiverAddr: string;
  receiverName: string;
  recipient: string;
  result: string;
  senderName: string;
  trackingDetails: TrackingDetail[];
  orderNumber: string | null;
  estimate: string | null;
  productInfo:  string | null;
  zipCode: string | null;
  lastDetail:TrackingDetail;
  lastStateDetail: TrackingDetail;
  firstDetail :TrackingDetail;
  completeYN :string
}

interface Company {
  International: string,
  Code: string,
  Name: string
}

interface ThemeColor{
  [key:string] :{ //중첩객체에서는 key값이 문자열밖에 못옴 숫자불가능
    back:string;
    hover:string;
    active:string;
    text:string;
    outline:string;
    odd :string;
    after:string;
    border:string;
    rgb:string;
  }
}
interface ButtonType {
  name:string;
  theme:string;
}

function App() {

  const [carriers,setCarriers]=useState<Company[]>([]);
  //필터되어서 보여지는 데이터 (국내/국외)
  const [allCarriers,setAllCarriers] = useState<Company[]>([]);
  //국내,국외 택배사 정보를 모두 넣어서 필터시켜서 국내/국외 설정해줌
  const [theme,setTheme]=useState<string>('default');
  //색깔바뀌게 하는거
  //중첩객체를 넣어야함 
  const[tcode,setTcode]=useState<string>('04');
  // 택배사 코드 > 04는 대한통운을 기본으로 설정함
  const[tinvoice,setTinvoice]=useState<string>('');
  // 운송장 번호
  const [tname,setTname]=useState<string>('cj대한통운');
  const [isBtn,setIsBtn] =useState<number|null>(null);
  // const [isBtn,setIsBtn] =useState<number>();
  const [infoTracking,setInfoTracking] = useState<PackageData | null>(null);
  // postman에서 send 한 정보를 다가져와야함
  // 1026-1
  const[isLoading,setIsLoading] =useState<boolean>(true);
  const[isShow,setIsShow]=useState<boolean>(false);
  const[error,setError]=useState<string>('');
  const themeColor :ThemeColor = {
    "default":{
      "back":"bg-indigo-500",
      "hover":"hover:bg-indigo-300",
      "active":"bg-indigo-400",
      "text":"text-indigo-500",
      "outline":"outline-indigo-300",
      "odd":"odd:bg-indigo-50",
      "after":"after:bg-indigo-500",
      "border":"border-indigo-300",
      "rgb":"#6366f1"
    },
    "teal":{
      "back":"bg-teal-500",
      "hover":"hover:bg-teal-300",
      "active":"bg-teal-400",
      "text":"text-teal-500",
      "outline":"outline-teal-300",
      "odd":"odd:bg-teal-50",
      "after":"after:bg-teal-500",
      "border":"border-teal-300",
      "rgb":"#008080"
    },
    "sky":{
      "back":"bg-sky-500",
      "hover":"hover:bg-sky-300",
      "active":"bg-sky-400",
      "text":"text-sky-500",
      "outline":"outline-sky-300",
      "odd":"odd:bg-sky-50",
      "after":"after:bg-sky-500",
      "border":"border-sky-300",
      "rgb":"#87CEEB"

    },
    "violet":{
      "back":"bg-violet-500",
      "hover":"hover:bg-violet-300",
      "active":"bg-violet-400",
      "text":"text-violet-500",
      "outline":"outline-violet-300",
      "odd":"odd:bg-violet-50",
      "after":"after:bg-violet-500",
      "border":"border-violet-300",
      "rgb":"#7F00FF"
    }
  }
  //중첩객체 사용법? themeColor['orange'].hover

  const buttons : ButtonType[] =[ 
    {name:"기본",theme:'default'},
    {name:"teal",theme:'teal'},
    {name:"sky",theme:'sky'},
    {name:"violet",theme:'violet'}
  ]
 

  useEffect(()=>{

    const fetchData = async() =>{
      try{
        const res = await fetch(`https://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)
        const data = await res.json()
        console.log(data);
        setAllCarriers(data.Company);
        setCarriers(data.Company);
        setIsLoading(false);

      }catch(error){
        console.log(error)
      }
    }
    fetchData();
  },[])

  const selectCode = (BtnNumber:number,code:string,name:string) =>{
    setIsBtn(BtnNumber);
    setTcode(code);
    setTname(name);
    const isInternational = BtnNumber === 2 ? 'true' : "false" 
    // 국외는 문자열로 true / false 값을 받기 때문에 설정해줌
    const filterCarriers = allCarriers.filter(e=>e.International === isInternational);
    // 필터해서 내가 선택한 국외택배사가 국외라면
    setCarriers(filterCarriers);
    //필터된 캐리어에 집어넣음
  }
  const blindNumber = (e:React.ChangeEvent<HTMLInputElement>) =>{ 
    //oninput 이벤트는 string을 받을 때 위의 코드처럼 받아야함
      const value = e.target.value;
      if(isBtn === 1){
        e.target.value = e.target.value.replace(/[^0-9]/g,'')       
      }
      setTinvoice(value)
  }
  const PostSubmit = async() =>{
    // console.log(tcode,tinvoice,tname)
    // const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)
    // const url = new URL('http://info.sweettracker.co.kr/api/v1/trackingInfo');
    // url.searchParams.append("t_code",tcode);
    // url.searchParams.append("t_invoice",tinvoice);
    // url.searchParams.append("t_key",`${process.env.REACT_APP_API_KEY}`);
    // console.log(url);
    setIsLoading(true);
    setIsShow(false);
    setError(''); //운송장 번호 입력시 초기화하기 위해서 (올바른 운송장 번호를 입력했을때 에러표시가 안뜨게 하려고 초기화시켜줌)
    try{
      const res = await fetch (`https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`);
      const data = await res.json();
      if(data.firstDetail === null){
        setError("유효하지 않은 운송장번호 이거나 택배사 코드 입니다.")
        setIsLoading(false)
        return;
      }
      if(data.code === '104' || data.code === '105'){
        setError(data.msg);
      }else{
        setInfoTracking(data); //데이터가 왔을때 배송정보가 보여지도록 하기 위해서
        setIsShow(true)
      }
      setIsLoading(false);
      console.log(data); //pending 세번째 클릭하면 데이터가 나옴
    }catch(error){
      console.log(error)
    }
  }
  const PostListName :string[] = ["상품인수","상품이동중","배송지도착","배송출발","배송완료"];

  return (
    <>
    {
      isLoading && 
      <div className="fixed w-full h-full bg-black/50 top-0 left-0 z-50">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="rotate(0 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(30 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(60 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(90 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(120 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(150 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(180 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(210 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(240 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(270 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(300 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(330 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
          </rect>
        </g>
        </svg>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }
      {/* <p>{themeColor[theme] && themeColor["sky"].back}</p> //&&는 앞에 데이터가 있을떄 뒤에가 실행되도록 하는것(에러방지용임 >> 습관으로 계속 적어주는게 좋음)
      <p className="text-center text-purple-500 text-lg font-bold italic">Lorem ipsum dolor sit amet.</p> */}
      <div className={`${themeColor[theme].back} p-5 text-white text-sm md:text-xl xl:text-2xl flex justify-between`}>
        <h3 className="font-extrabold">국내.외 택배조회 시스템</h3>
        <div className="">
          <span className="">테마 :</span>
          {
            buttons.map((e,i)=>{
              return(
                <button key={i} className={`mx-1 md:mx-2 xl:mx-3 ${themeColor[theme].active}`} onClick={()=>{setTheme(e.theme)}}>{e.name}</button>
                //재렌더링 되는 state 값을 변경해줘야함
              )
            })
          }
        </div>
      </div> 
      <div className="w-4/5 md:w-3/5 xl:1/3 mx-auto my-40 flex roudned items-center pt-2 flex-wrap "> 
        <div className="basis-full py-2 px-2 flex justify-center items-center text-md">
          택배 검색
        </div>
        
        <div className="border-b basis-full py-2 px-2 flex justify-center items-center text-sm">
          <span className=" text-center mr-5">국내 / 국외 선택</span>
          <button onClick={()=>selectCode(1, '04' ,'CJ대한통운')} className={`text-sm border p-1 px-5 rounded hover:text-white mr-4 ${isBtn === 1 ? "text-white" :"text-black"} ${themeColor[theme].hover} ${isBtn === 1 && themeColor[theme].active} `}>국내</button>
          <button onClick={()=>selectCode(2, '12' ,'EMS')} className={`text-sm border p-1 px-5 rounded hover:text-white  ${isBtn === 2 ? "text-white" :"text-black"} ${themeColor[theme].hover} ${isBtn === 2 && themeColor[theme].active}`}>국외</button>
        </div>
        {/* {tcode}{tname} */}
        <div className="basis-full py-4 border-b">
          <select className='w-full border p-2 rounded-md appearance-none outline-none' value={tcode} onChange={(e)=>{
            const result_code = e.target.value;
            setTcode(e.target.value);
            const result = carriers.find((e)=> e.Code === result_code)
            if(result){
              setTname(result.Name);
            }
          }}>
            {/* appearance-none */}
            {
              carriers.map((e,i)=>{
                return(
                    <option key={i} value={e.Code}>{e.Name}</option>
                )
              })
            }
          </select>
        </div>
        {tinvoice}
        <div className="basis-full py-4 border-b text-center">
            <input type="text" onInput={blindNumber} placeholder='운송장 번호를 입력해주세요' className={`w-full border px-5 py-2 rounded-md outline-indigo-300 ${themeColor[theme].outline}`}/>
        </div>
        <div className="basis-full border-b py-4 text-center">
          <button onClick={PostSubmit} className={`${themeColor[theme].back} text-white px-4 py-2 rounded-md w-full`}>조회하기</button>
        </div>
        { 
            error &&
            <div className="basis-full text-center py-4 border-b">
              <span className={`${themeColor[theme].text} font-bold`}>{error}</span>
            </div>
        }
    </div>
    {
      isShow &&   //조회가 되면 택배의 배송정보가 보여지는것 
      <>
        <div className="w-full">
            <div className={`${themeColor[theme].back} text-white flex justify-center py-10 px-5 flex-wrap items-center text-center`}>
              <span className="text-xl basis-[45%] font-bold mr-5 mb-5">운송장 번호</span>
              <h3 className='text-2xl basis-[45%] font-bold mb-5'>{tinvoice}</h3>
              <span className="text-xl basis-[45%] font-bold mr-5 mb-5">택배사</span>
              <h3 className='text-2xl basis-[45%] font-bold mb-5'>{tname}</h3>
            </div>
        </div>
        <div className="bg-white my-5 flex justify-around py-5 relative before:absolute before:bg-[#e2e5e8] before:h-0.5 before:box-border before:top-[45%] before:left-[10%] before:w-4/5 before:z-0">
          {
            Array(5).fill('').map((_,i)=>{
              const resultLevel = infoTracking && i + 1 === (infoTracking?.level - 1);
              return(
                  <div key={i} className={`${resultLevel ? themeColor[theme].after : 'after:bg-gray-200'} relative z-10 after:absolute after:w-[60px] after:h-[60px] after:rounded-full after:left-0 after:top-0`}>
                    <img className='relative z-10 ' src={`images/ic_sky_delivery_step${i+1}_on.png`} alt={PostListName[i]} />
                    <p className={`text-center text-xs mt-1 ${resultLevel ? `${themeColor[theme].text} font-bold` :""} `}>{PostListName[i]}</p>
                  </div>
              )
            })
          }
        </div>
        <div className="bg-white py-5">
          {
              infoTracking && infoTracking.trackingDetails.slice().reverse().map((e,i)=>{
                //배열에서 어떤것을 추출해서 수정 삭제하려면 slice()를 이용함 그리고 순서를 뒤집으려면 reverse()
                return(
                  <div className={`${themeColor[theme].odd} pl-20 py-5 relative group`} key={i}>
                    <div className={`${i === 0 ? `${themeColor[theme].back} ${themeColor[theme].border}` : 'bg-white'} relative border-2 rounded-full w-2 h-2 -left-[30px] top-10 z-30`}></div>
                    {/*  
                      infoTracking.trackingDetails.length - i - 1) === infoTracking.level -1
                      infoTracking.trackingDetails.length = 5 
                        반복문을 통해서 i 값이 증감
                        현재 0번부터 시작하기 때문에 -1 
                        첫번째 5 - 0 - 1 = 4 
                        두번째 5- 1- 1 = 3
                        세번쨰 5- 2- 1 = 2
                        네번째 5- 3- 1 = 1
                        다섯번째  5- 4- 1 = 0
                    */}
                    <p>{e.where} | {e.kind}</p>
                    <p>{e.telno}</p>
                    <p>{e.timeString}</p>
                    <div className={`group-last:h-0 h-full absolute w-0.5 left-[53px] top-[60px] z-20 ${themeColor[theme].back}`}>

                    </div>
                  </div>
                )
              })
          }
        </div>

      </>
    }
    </>
  );
}

export default App;
