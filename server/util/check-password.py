import sys
import bcrypt

pwd = sys.argv[1]
hash = sys.argv[2]

bytePwd = pwd.encode('utf-8')
mySalt = bcrypt.gensalt()
hashPwd = bcrypt.hashpw(bytePwd, mySalt)

hashBytes = hash.encode()

print(bcrypt.checkpw(bytePwd, hashBytes))
