import sys
import bcrypt

print(bcrypt.__file__)

pwd = sys.argv[1]
bytePwd = pwd.encode('utf-8')

mySalt = bcrypt.gensalt()
hashPwd = bcrypt.hashpw(bytePwd, mySalt)

print(hashPwd)
