import requests
from bs4 import BeautifulSoup


# 사람인 크롤링 부분
def get_linked_last_page(url):  # 마지막 페이지를 찾아오는 함수
    result = requests.get(url)
    soups = BeautifulSoup(result.text, "html.parser")
    pages = soups.find("div", {"class": "pagination"}).find_all(
        "span")
    last_page = pages[-1].get_text(strip=True)
    return int(last_page)


def extracting_jobs(html):  # 직업을 찾아내는 함수
    job_title = html.find("h2", {"class": "job_tit"}).find("a")[
        "title"]
    company = html.find("div", {"class": "area_corp"}).find(
        "span")
    location = html.find("div", {"class": "job_condition"}).find(
        "a")
    company = company.get_text(strip=True)
    location = location.get_text(strip=True)
    job_id = html['value']
    return ({
        'jobName': job_title,
        'company': company,
        'region': location,
        'applyLink': f"http://www.saramin.co.kr/zf_user/jobs/relay/view?isMypage=no&rec_idx={job_id}",
        'type': 'SARAMIN',
    })


def extracting_jobs_parse(last_page, url):  # 페이지를 하나씩 넘기는 함수
    jobs = []
    for page in range(last_page):
        print(f"사람인에서 불러오는 중입니다. 페이지:{page + 1}")
        result = requests.get(f"{url}&pg={page + 1}")
        soups = BeautifulSoup(result.text, "html.parser")
        job_results = soups.find_all("div",
                                     {"class": "item_recruit"})
        for result in job_results:
            job = extracting_jobs(result)
            jobs.append(job)
    return jobs


def find_jobs(work_id):  # 사람인 최종 함수
    url = f"http://www.saramin.co.kr/zf_user/search/recruit?&searchword={work_id}&recruitPageCount=200"
    last_page = get_linked_last_page(url)
    jobs = extracting_jobs_parse(last_page, url)
    return jobs


# Indeed 크롤링 부분
def get_last_page(url):  # 마지막 페이지를 찾아오는 함수
    result = requests.get(url)
    soup = BeautifulSoup(result.text, "html.parser")
    pagination = soup.find("div",
                           {"class": "pagination"})
    links = pagination.find_all('a')
    pages = []
    for link in links[:-1]:
        pages.append(int(link.string))
    max_pages = pages[-1]
    return max_pages


def extract_job(html):  # 직업을 찾아내는 함수
    title = html.find("h2", {"class": "title"}).find("a")[
        "title"]
    company = html.find("span", {"class": "company"})
    if company:
        company_anchor = company.find("a")
        if company_anchor is not None:
            company = str(company_anchor.string)
        else:
            company = str(company.string)
        company = company.strip()
    else:
        company = None
    location = html.find("div", {"class": "recJobLoc"})[
        'data-rc-loc']
    job_id = html["data-jk"]
    return {'jobName': title,
            'company': company,
            'region': location,
            "applyLink": f"https://kr.indeed.com/viewjob?jk={job_id}",
            "type": 'INDEED'
            }


def extract_jobs(last_page, url):  # 페이지를 넘기는 함수
    jobs = []
    LIMIT = 50
    for page in range(last_page):
        print(f"Indeed에서 불러오는 중입니다. 페이지:{page + 1}")
        result = requests.get(f"{url}&start = {page * LIMIT}")
        soup = BeautifulSoup(result.text, "html.parser")
        results = soup.find_all("div", {
            "class": "jobsearch-SerpJobCard"})
        for result in results:
            job = extract_job(result)
            jobs.append(job)
    return jobs


def get_jobs(work_id):  # Indeed 최종 호출 함수
    url = f"https://kr.indeed.com/%EC%B7%A8%EC%97%85?q={work_id}&limit=50"
    last_page = get_last_page(url)
    jobs = extract_jobs(last_page, url)
    return jobs
