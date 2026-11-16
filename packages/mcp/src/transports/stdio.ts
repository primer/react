import {serveStdio} from '@modelcontextprotocol/server/stdio'
import {createServer} from '../server'

serveStdio(createServer)
