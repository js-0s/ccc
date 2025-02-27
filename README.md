# Web3 Wallet Check

Allow people to check their on-chain-balance.

This is roughly based on a coding challenge found in public github 
repositories. Thats the reason it contains references to the regen-network
here and there but it should be seen as a learning project how to access 
different chains and interact with the keplr wallet. It also explores challenges
that only surface when deployed to the public.

## Launch

`host > docker compose run --rm shell`
enter a shell with the regen ledger installed and pnpm available to lint
the code, install packages. run `pnpm install` and `pnpm db:dev` while you 
set the environment.

`ccc /app # cp .env.example .env`
`ccc /app # vi .env` and set a random auth-secret

then run

`host > docker compose up ccc`

start a local db, the web-app and host it on port 1918 in development mode. The
experience is not-so-ideal because nextjs compiles pieces on demand

## Usage

1. create a new (chrome) browser profile
2. navigate to http://localhost:1918
3. enjoy the 'public' website with some text and generated images
4. click 'join/sign in', enter any username & password
5. navigate to the 'Setup' page and follow the instructions
6. navigate to the 'Dashboard' page and explore the features

## Technical Features

- Simple User storage that stores their password along with a list of Chains
  and Balances. That information is exposed only to the currently signed in
  user, others are not able to access other users, not even by manually
  querying the graphql environment
- Database Schema:
  User 1-n Chain
  implemented with prisma
- Graphql Schema:
  User (Session) Queries secured by only accessing information that belongs
  to the currently signed in user.
- NextAuth Session
  Session handling, Authentication using bcrypt/salted passwords, possibility
  to extend with other Auth services
- Next 15 app-router based setup that enforces session state and exposes public
  read-only pages.
- React 19/TailwindCSS based component library using shadcn/ui
- gqty data context to disconnect data-fetching from component rendering
- web3 service context that abstracts the use of the window.keplr object
  from the component functionality
- web3 library functions that wrap specific functionality into a common
  terminology
- typescript code that ensures correct usage of exposed functions
- build configuration and deploy-configuration (using caprover)

## User Features

This application is not actually useful for users, its (badly) mimicing the
functionality that is already present in the wallet applications: Display the
users-balance for one or more of their wallet-chains and sending tokens of
that chain to other addresses. The UI is a rough sidebar/table/dialog based
interface that guides through the required setup. The application stores the
addresses of the user in the database and allows it to query balances without
the wallet interaction. It interacts with the browser wallet to get signatures
and broadcasts them to the network using the browser-wallet-app or sending the
signed transaction from the server. The later was required because the testnet
it was implemented on only exposes a http endpoint while the application was
deployed in a https-environment.

# Code Map

In order to review the code or learn from it, a rough map of the application
and its files & directories.

## /package.json

contains the scripts that power the deployment and development process.

Developers use
`pnpm db-dev` to update the database schema (after changes in /prisma)
`pnpm format:write` to ensure code formatting
`pnpm lint` to spot typescript errors and warnings
`pnpm generate` to sync the backend graphql-schema with the frontend gqty
                schema
`pnpm dev` to run the dev-server
`pnpm build` build the nextjs production bundle. needs a restart of the 
             dev-server afterwards. useful to check if a deployment works.
`pnpm chown` ensure all generated sources are owned by the host-user

Ops use
`npm start-seed` to ensure the correct db-structure is available in the
                 connected db-server. :warning: this accepts data-loss, for
                 full migration a additional approach should be choosen
`npm start` run the 'compiled' application in production mode

## /._docker._/i

`docker-compose.yml` is the development environment with a container that runs
the application in dev-mode and a database. It exposes the node_modules as
volume for hooking up a development environment (eg vs-code) to use the same
versions for typescript/prettier but that needs additional configuration
(`mount -o bind`) and a linux environment. uses the `Dockerfile` which is a
environment that the developer enters with `docker compose run --rm shell` to
interact with pnpm and has multiple (cli) development tools installed. in that
shell the developer is root and able to interact with the source with full
control, all pnpm-cache, history, executed commands can easily be cleared. This
ensures a consistent multi-developer environment.
`docker compose up ccc` starts the app in dev-mode (running `npm dev`) and
allows the developer to interact with the app including hot-reloading and
without compromising the developer-machine with potentional malicous code.
The developer never executes pnpm-commands on the host, only in the shell and
therefor has a isolated environment that is very close to the production.
`Dockerfile.deploy` is a multistage build dockerfile that for production use
installs only minimal software and strips the node_modules from development
dependencies. It contains hints how to adapt for initial deployment.

## /prisma

`schema.prisma, seed.ts`

This is the database structure. in order to power the user-chain relation a
postgres database needs to be configured with the schema (`pnpm  db:dev`)
For later enhancements, the prisma directory will contain the schema migrations
`pnpm prisma migrate --dev name` that allow hot production updates. The seed.ts
creates some initial users. When the data-schema evolves, this is a good place
to share a from-scratch dataset that allows developers to start coding without
handling database-dumps or manually setting up data using a ui

## /public

some ai-generated images to make the landing page look less boring

## /src

all application code, the path nextjs suggests for all the code and typescript
will do its magic on

## /src/app/api

contains the graphql endpoint and the next-auth endpoint, just basic
boilerplate

## /src/app

is the entrypoint for all components. Its using the nextjs app-based routing
to separate concerns

## /src/app/[join|learn|pricing|page.tsx]

some text to allow the visitor to get a idea what to expect from the page
before logging in

## /src/app/[layout.tsx|providers.tsx]

default layout & providers that should be available to all pages. ui
related like modal/tooltip/alert functionality,

This is the place where the web3-context is initialized so any component
may request wrapped kepl-functions

## /src/app/[account|dashboard|setup]/page.tsx

session-mandatory, Sidebar-wrapped pages that use the custom components to
display the user-interface.

Those are interesting because they are the root for SSR and declare the main
contexts that are in place for the components.

### setup/page.tsx

User description what is required for setup. Exposes components 'SuggestChain'
and 'SelectChain' and provides required context for them.

### dashboard/page.tsx

Organize the main application components (a hint if there was a setup executed
a table of stored user-chains and a list of actions available to the user)
wrapped into the required `UserDataContextProvider`

### account/page.tsx

Very simple management of account/user related functionality to change the
email the password, phone and display the login/logout dates

## src/components

The components-root contains some components that hae been collected from the
internet and adapted for the needs of the application. They are of a general
nature and use the shadcn/ui patterns that is also found in the components/ui
directory

## src/components/ui

shadcn/ui managed directory with components added for the application (eg with
`pnpm dlx shadcn@latest add accordion`. this directory is mostly untouched
(`format:write` transforms it a bit) and only modifies minor details (eg the
`z-[5001]` classNames used to ensure that all dialogs/alerts are above a
`leaflet` area.

## src/components/page

general page components like the header/footer or signin button that is
used in the public pages.

## src/components/[setup|user|web3]

This are the components implemented for this application. They share the
pattern that they expose the components that should be used by others in
a`index.ts` and reference their peer-components in the directory
(eg user/content uses ./email to generate the form for changing the
users-email) peer-components are for code separation and keeping the
main/page-exposed components simple and easy to understand.

### setup

just a styled counter of the users stored chains or a hint for the user to
start the setup

### user

components that interact with the session-user, dialogs/forms for modifying the
email/phone etc. `chainActions` `chains` and `data` are the really interesting
components.

### user/chainActions

component that displays a button to refresh the balances of the configured
chains. its using the context-user and calls context-callbacks to execute and
ensures that the user does not interact with the button when there are no
chains setup or while the refresh is executing

### user/data

the userDataContext is the interface between components and the graphql backend
this is a pattern that avoids that components are sprinkled with graphql
request or mutation configuration making them hard to reuse, debug or
understand. Instead all data related code is implemented here and allows for
replacement of the query library, optimizations, summarizing of functionality
(eg refetch when certain actions were executed with success). Its using the
gqty/prepass pattern to ensure that all data is requested in a single query
and that the context-data 'user' always has a defined structure that
components can rely on. It makes sure that mutations query only the required
responses and receive the correct parameters and summarizes their loading
state into one single boolean. all the exposed values are stored in a memo
which ensures that when renders do not affect the value do not cause
child-components to render

### user/chains

a table that displays the user-chain collection with actions for each row. As
those actions (implemented in `src/components/web3`) show a dialog some logic
to only show the appropriate dialog with the correct row-id is in place. As
the data to display differs from the data stored (we store balance as minDenom
but would like to show the user their balance in denom and display the
friendly chain-name instead of the stored chain_id) a useMemo transforms the
user.chains collection for the table display.
:warning: a great enhancement would be to put the display balance code in a
lib/utility to reuse it

## src/components/web3

Those components implement interaction with the wallet-app or the backend chain
functionality (or both)

### selectChain

A Dialog that displays a list of known chains to select. When the user choses
one, the wallet-app is asked for the address of that chain and this is sent to
the backend for populating the chains-table. As a special the user can select
'custom' to enter any chain-name not available in the list.
:warning: Unfortunately, the list for the chains is not a great source of data
 only a few chains really work with the keplr-app. Read this component to see
 `react-hook-form` along with `shadcn/ui dialog` in action to handle
 form.watch events and generically display errors

### sendToken

A Dialog that allows the user to enter a amount, switch between minDenom and
Denom, formatting the input in a selected locale (currently `en-US`) On submit
the amount is converted into minDenom and the backend is requested to request
the RPC for the address-account-number and sequence. Then all that information
is compiled into a protoBuf transaction and presented to keplr for signing.
When the signature is received, the transaction is serialized and send to the
backend for broadcasting. Also see the affiliated methods of the graphql
schema: `/src/graphql/repository/Chain.mutation.ts` and the actual cosmos-js
implementation in `src/lib/web3`.

The reason this is implemented this way is because when the application is
deployed to a host with https enabled, keplr nor the stargate client in the
app can communicate with non-https RPC endpoints or may be blocked by CORS.
This is less convienient for the user as they do not see the progress of the
transaction broadcast

### sendTokenKeplr

Same dialog like `sendToken`, only the on submit implementation uses the 'easy'
way asking keplr to sign and broadcast the transaction.

### signMessage

A very simple dialog that lets the user enter any string and requests keplr to
sign arbitrary messages. When the signature is returned its displayed in a
GGP-like structure.
:warning: there is no verify for that structure. The dialog/message is only
 demoing that basic keplr functionality

### suggestChain

A Dialog that allows the user to use the keplr suggest feature. Some of the
chains can be added that way and using the custom option its even possible to
paste json that keplr will then try to interpret. This dialog is important for
onboarding users to unknown/testnet chains.

## src/context

context for the components. This includes the web3 context that wraps the
keplr-function calls and the chains which are a combination of hardcoded and
remote-requested.

the ability context is to bootstrap functionality that may check access based
on user-role and instances but is not used in this application yet.

## src/graphql

This is the schema and repository exposed by the app's grapql api. Its using 
nexus declarative, code-first GraphQL schemas for javaScript/typeScript and is
split into `schema` and `repository`. The index.ts ensures that the Queries
need a session to be requested and joins all of them for booting the apollo
server

### schema

In nexus the schema is declared with description and resolver-methods in
typescript. instead of using a SDL. This allows the developer to continue
coding and define both object structures and mutations that are forwarded to
the repositories. The general approach is to keep the schema focused on
argument types and structure and let the repositories handle the
implementation details.

### repository

All code called from schema-resolvers or otherwise related to database-access.
The repository naming is matching the prisma-schema-model names and for
separation of concerns is split into [get,list,mutation]

### Auth

Access control for more sophisticated applications, stripped down because there
is no models to control access to (`casl` abilities help with rules that are
automatically checking access to certain models and fields.

### Context

Each resolver passes a context object, this is defined in this repository and
ensures that the session is set (from next-auth) and populated with the db-state
of the user and a db-handle is available and the abilities are prepared.

### Error

Error classes to be thrown by the repositories

### Chain.mutation

Repository wrapping calls that ensure the `src/lib/web3` methods have access to
a chain-object

### User[.get|.list|.mutation]

Repository that implement the database reading of a single user, collections
that the user has access to and User mutating updates. It includes some logic
required for signin. User.mutation: refreshChains is the implementation of the
cosmos/stargate client requesting the balance of the stored addresses.
:warning: code should be moved to `Chain.mutation::refreshChainBalance` and to src/lib/web3 to separate the cosmos code from the database-code.

## /src/hooks

code added for shadcn/ui

## /src/lib

code shared between frontend and backend

### auth

`casl` ability definition

### graphql

index.ts/schema.generated.ts: `gqty` setup that exposes the
useQuery/useMutation to the client components server.ts `apollo` server setup
used by `/src/app/api/graphql`

### version

semver version code that exposes the current running application version. used
in graphql query to display in frontend for production purposes

### web3

wrapper for various web3 concepts like address, check the balance using
cosmjs/stargate or regen-network/api

#### chains

utility to access the chains known to keplr and easily accessing the common 
attributes like denom, name, decimals

#### hardcodedChains

list of chains that are not in a official registry but convenient for this
application

#### sign

methods related to signing transactions or preparing the signature

## src/server

configuration for next-auth and prisma

## src/styles

global tailwindcss configuration

# Reading Suggestion

Now that you got a overview of the project, start browsing the code. The most
interesting pieces are implemented in `src/lib/web3` `src/components/web3` and
`src/context/web3`. 

All the other files are boilerplate to make the application work and being able
to display something useful. That pattern is used in multiple production
projects and was successful to scale building very complex applications
managed by large teams with developers of different skill-sets. Its missing
tests, for scaling the backend-part should be extracted into a dedicated
project and storybook needs to be integrated. The data-context pattern has
drawbacks especially when it is used nested that may only be resolved with
replacing the graphql-query engine. There should be more time invested to DRY
some components, straighten the terminology of publicKey and address and
separating repository-functionality.
