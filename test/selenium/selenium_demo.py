from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("http://test.thegnarlytyke.com.s3-website.eu-west-2.amazonaws.com/index.html")
print(driver.title)