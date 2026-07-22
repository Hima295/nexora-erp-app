from setuptools import setup, find_packages

with open("requirements.txt", "r") as f:
    install_requires = [line.strip() for line in f if line.strip() and not line.startswith("#")]

setup(
    name="aljawhara",
    version="0.0.1",
    description="Enterprise-grade custom Frappe application extending ERPNext v15+",
    author="Aljawhara Engineering Team",
    author_email="dev@aljawhara.internal",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)
