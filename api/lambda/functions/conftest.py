from pytest import fixture

def pytest_addoption(parser):
    parser.addoption(
        "--email",
        action="store"
    )
    parser.addoption(
        "--password",
        action="store"
    )

@fixture()
def email(request):
    return request.config.getoption("--email")

@fixture()
def password(request):
    return request.config.getoption("--password")
